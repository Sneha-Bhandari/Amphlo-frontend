import ConnectedCountries from "@/PageComponent/Home/ConnectedCountries";
import CrmContent from "@/PageComponent/Home/CrmContent";
import FAQ from "@/PageComponent/Home/FAQ";
import GetInTouch from "@/PageComponent/Home/GetInTouch";
import HeroSection from "@/PageComponent/Home/HeroSection";
import OurCoreStrength from "@/PageComponent/Home/OurCoreStrength";
import OurPartner from "@/PageComponent/Home/OurPartner";
import ServicesAndOffering from "@/PageComponent/Home/ServicesAndOffering";
import Testimonials from "@/PageComponent/Home/Testimonial";

export default function Home() {
  return (
    <div>
      <HeroSection/>
      <OurCoreStrength/>
      <CrmContent/>
      <ServicesAndOffering/>
      <Testimonials/>
      <ConnectedCountries/>
      <OurPartner/>

      <FAQ/>
      <GetInTouch/>

    </div>
  );
}
