import FAQ from "@/PageComponent/Home/FAQ";
import GetInTouch from "@/PageComponent/Home/GetInTouch";
import OurPartner from "@/PageComponent/Home/OurPartner";
import WhyPartnerWithUs from "@/PageComponent/PartnerWithUs/WhyPartnerWithUs";
import OurTopServices from "@/PageComponent/UniversityPage/OurTopServices";
import UniversityBanner from "@/PageComponent/UniversityPage/UniversityBanner";

export default function University(){
    return(
        <div>
           <UniversityBanner/>
            
            <WhyPartnerWithUs/>
            <OurTopServices/>
            <OurPartner/>
            <FAQ/>
            <GetInTouch/>
        </div>
    )
}