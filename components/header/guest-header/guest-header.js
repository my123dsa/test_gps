import classes from "./guest-header.module.css";
import Link from 'next/link';
import Image from "next/image";
import { getGeocode } from "@/utils/getGeocode";

export default function GuestHeader () {
    const logoWidth = 240;
    const click = getGeocode("서울 마포구 월드컵북로 434"+ "상암 IT Tower");
    return (
        <header className={classes.header_box}>
            <div className={classes.header_container}>
                <div className={classes.header_left}>
                    <Link href="/onboarding">
                        <Image 
                            className={classes.logoBox} 
                            src="/images/logo.png" 
                            alt="집계사장" 
                            width={logoWidth}
                            height={logoWidth * 0.26}
                            priority
                        />
                    </Link>
                </div>
                <div className={classes.header_right}>
                    <button onClick={click}>버튼</button>
                    <Link href="/login">
                        <button className={classes.profile_button}>로그인</button>
                    </Link>
                    <Link href="/signup">
                        <button className={classes.profile_button}>회원가입</button>
                    </Link>
                </div>
            </div>
            
        </header>
    )
}