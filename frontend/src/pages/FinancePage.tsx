import Header from "@/components/Header"
import Finance from "@/components/Finance"
import Footer from "@/components/Footer"

const FinancePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Finance />
      </main>
      <Footer />
    </div>
  )
}

export default FinancePage