import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, conversationId, chatType } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Fetch uploaded documents if conversation exists
    let documentsContext = '';
    let documentsList: string[] = [];
    
    if (conversationId) {
      const { data: documents } = await supabase
        .from('chat_documents')
        .select('file_name, file_data')
        .eq('conversation_id', conversationId)
        .eq('chat_type', chatType);

      if (documents && documents.length > 0) {
        for (const doc of documents) {
          documentsList.push(doc.file_name);
          
          try {
            const base64Data = doc.file_data.split(',')[1] || doc.file_data;
            const decodedContent = atob(base64Data);
            
            // Check if it's a PDF
            if (doc.file_name.toLowerCase().endsWith('.pdf')) {
              // For PDFs, try to extract any readable text
              // PDFs contain binary data but may have readable text sections
              const textMatch = decodedContent.match(/[\x20-\x7E\s]{20,}/g);
              if (textMatch && textMatch.length > 0) {
                const extractedText = textMatch.join(' ').trim();
                if (extractedText.length > 100) {
                  documentsContext += `\n\nDocument: ${doc.file_name} (PDF)\n${extractedText.substring(0, 10000)}`;
                  console.log(`Extracted partial text from PDF ${doc.file_name}`);
                } else {
                  documentsContext += `\n\n[PDF "${doc.file_name}" has been uploaded. The system can see the document but text extraction is limited. You can view it in the preview pane.]`;
                }
              } else {
                documentsContext += `\n\n[PDF "${doc.file_name}" has been uploaded. The system can see the document but text extraction is limited. You can view it in the preview pane.]`;
              }
            } else {
              // Try text extraction for non-PDF files
              const isProbablyText = /^[\x20-\x7E\s]+/.test(decodedContent.substring(0, 100));
              if (isProbablyText && decodedContent.length < 100000) {
                documentsContext += `\n\nDocument: ${doc.file_name}\n${decodedContent}`;
              }
            }
          } catch (e) {
            console.error(`Error processing ${doc.file_name}:`, e);
            documentsContext += `\n\n[Document "${doc.file_name}" has been uploaded and is visible in the preview pane]`;
          }
        }
      }

      // Also fetch resume data if in resume chat type
      if (chatType === 'resume') {
        const { data: resumes } = await supabase
          .from('career_resumes')
          .select('file_name, file_data')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (resumes && resumes.length > 0) {
          const resume = resumes[0];
          documentsList.push(resume.file_name);
          
          try {
            const base64Data = resume.file_data.split(',')[1] || resume.file_data;
            const decodedContent = atob(base64Data);
            
            // Check if it's a PDF
            if (resume.file_name.toLowerCase().endsWith('.pdf')) {
              // For PDFs, try to extract any readable text
              const textMatch = decodedContent.match(/[\x20-\x7E\s]{20,}/g);
              if (textMatch && textMatch.length > 0) {
                const extractedText = textMatch.join(' ').trim();
                if (extractedText.length > 100) {
                  documentsContext += `\n\nMain Resume: ${resume.file_name} (PDF)\n${extractedText.substring(0, 10000)}`;
                  console.log(`Extracted partial text from resume PDF ${resume.file_name}`);
                } else {
                  documentsContext += `\n\n[Resume "${resume.file_name}" has been uploaded. The system can see the document but text extraction is limited. You can view it in the preview pane.]`;
                }
              } else {
                documentsContext += `\n\n[Resume "${resume.file_name}" has been uploaded. The system can see the document but text extraction is limited. You can view it in the preview pane.]`;
              }
            } else {
              // Try text extraction for non-PDF files
              const isProbablyText = /^[\x20-\x7E\s]+/.test(decodedContent.substring(0, 100));
              if (isProbablyText && decodedContent.length < 100000) {
                documentsContext += `\n\nMain Resume: ${resume.file_name}\n${decodedContent}`;
              }
            }
          } catch (e) {
            console.error(`Error processing resume ${resume.file_name}:`, e);
            documentsContext += `\n\n[Resume "${resume.file_name}" has been uploaded and is visible in the preview pane]`;
          }
        }
      }
    }
    
    // Add document awareness even if we couldn't extract full text
    if (documentsList.length > 0 && !documentsContext) {
      documentsContext = `\n\nNote: The user has uploaded the following documents: ${documentsList.join(', ')}. While you cannot see the full content of PDF files, acknowledge that these documents have been provided and offer to help based on what the user tells you about them or ask them specific questions about the documents.`;
    }

    // System prompts based on chat type
    const systemPrompts: Record<string, string> = {
      finance: 'You are a helpful financial advisor assistant for students. Help with budgeting, expense tracking, and financial planning. Keep answers practical and student-focused. When documents are uploaded, reference them in your advice.',
      career: 'You are a career guidance counselor for students. Help with career planning, resume advice, job applications, and professional development. Be supportive and actionable. When documents are uploaded, analyze and reference them.',
      academic: 'You are an academic assistant for students. Help with study planning, course organization, and learning strategies. Provide clear, structured guidance. When documents are uploaded, analyze and reference them.',
      resume: 'You are a resume analysis expert. Analyze resumes for clarity, impact, effectiveness, and AI-generated content. Provide constructive, specific feedback. When a resume document is provided, analyze the visible content thoroughly. Focus on structure, keywords, achievements, and professionalism. If you can see resume content in the document context, provide detailed analysis. The document is also visible in the preview pane for the user to reference.'
    };

    const systemPrompt = systemPrompts[chatType] || systemPrompts.academic;
    const fullSystemPrompt = systemPrompt + documentsContext;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: fullSystemPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Insufficient credits. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI service unavailable');
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});