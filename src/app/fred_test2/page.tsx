"use client";

import Link from "next/link";
import Script from "next/script"
import { useEffect } from "react";
import { validateCaptcha } from "@/lib/actions";
import { CaptchaResponse } from "@/lib/schemas";

declare global {
    interface Window {
        RecaptchaOnSubmit: (token: string) => void;
    }
}

interface FormDataObject {
    [key: string]: string; // A generic approach for string-based input values
}

export default function Form() {


    useEffect(() => {
        window.RecaptchaOnSubmit = (token) => {
            const form = document.querySelector('form');
            if (!form) return;
    
            // Serialize the form data
            const formData = new FormData(form);
            const formObject = Object.fromEntries(formData.entries()) as FormDataObject;
    
            validateCaptcha(token, formObject);
        };
    }, []);
    
    
    

    return (
        <>
            {/* Documentaition: https://developers.google.com/recaptcha/docs/v3 */}
            <Script src="https://www.google.com/recaptcha/api.js" />
            <form>
                <input type="text" name="bruh" />
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
