import EnquiryBanner from "@/PageComponent/Enquiry/EnquiryBanner";
import EnquiryForm from "@/PageComponent/Enquiry/EnquiryForm";
import EnquiryInfo from "@/PageComponent/Enquiry/EnquiryInfo";

export default function Enquiry(){
    return(
        <div>
            <EnquiryBanner/>
            <EnquiryForm/>
            <EnquiryInfo/>
        </div>
    )
}