import FAQ from "@/PageComponent/Home/FAQ";
import GetInTouch from "@/PageComponent/Home/GetInTouch";
import PartnerBanner from "@/PageComponent/PartnerWithUs/PartnerBanner";
import PartnerForm from "@/PageComponent/PartnerWithUs/PartnerForm";
import WhyPartnerWithUs from "@/PageComponent/PartnerWithUs/WhyPartnerWithUs";

export default function PartnerWithUs(){
    return(
        <div>
            <PartnerBanner/>
            <WhyPartnerWithUs/>
            <PartnerForm/>
            <FAQ/>
            <GetInTouch/>
        </div>
    )
}