"use client";

import Link from "next/link";
import Script from "next/script"
import { useEffect } from "react";
import { validateCaptcha } from "@/lib/actions";

declare global {
    interface Window {
        RecaptchaOnSubmit: (token: string) => void;
    }
}

export default function Form() {
    useEffect(() => {
        window.RecaptchaOnSubmit = (token) => {
            validateCaptcha(token);
        };
    }, []);

    return (
        <>
            {/* Documentaition: https://developers.google.com/recaptcha/docs/v3 */}
            <Script src="https://www.google.com/recaptcha/api.js" />
            <form>
                <button
                    className="g-recaptcha"
                    data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    data-callback="RecaptchaOnSubmit"
                    data-action="submit"
                >Log-In</button>
                <strong className="block font-normal">
                    {/* DO NOT REMOVE THIS! or else legal trouble */}
                    This site is protected by reCAPTCHA and the Google <Link className="link" href="https://policies.google.com/privacy">Privacy Policy</Link> and <Link className="link" href="https://policies.google.com/terms">Terms of Service</Link> apply.
                </strong>
            </form>

        </>
    );
}
