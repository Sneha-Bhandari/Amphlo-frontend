import AboutBanner from "@/PageComponent/About/AboutBanner";
import AboutOurBusiness from "@/PageComponent/About/AboutOurBusiness";
import MissionAndVision from "@/PageComponent/About/MissionAndVision";
import OurFeatures from "@/PageComponent/About/OurFeatures";
import OurTeam from "@/PageComponent/About/OurTeam";

export default function About(){
    return(
        <div>
            <AboutBanner/>
            <AboutOurBusiness/>
            <OurFeatures/>
            <MissionAndVision/>
            <OurTeam/>
        </div>
    )
}