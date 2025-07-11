<script setup>
import { Mail } from 'lucide-vue-next';
</script>

<template>
    <div class="footer-container">
        <div class="newsletter-container">
            <div class="background"></div>
            <div class="header-m header">
                STAY UP TO DATE, JOIN OUR NEWSLETTER
            </div>
            <div class="newsletter-content">
                <div class="email-field">
                    <ButtonsInputField :icon="Mail" padding="15px 20px" placeholder="Enter your email address" />
                </div>
                <ButtonsUnfilled class="newsletter-button" label="Subscribe" width="100%" />
            </div>
        </div>
        <div class="footer-content">
            <div class="logo-container">
                <NuxtLink to="/" class="header-s logo">
                    LOVE.CO
                </NuxtLink>
                <div class="subtitle-l medium">
                    For the bold, the curious, and<br> the effortlessly cool.
                </div>
            </div>
            <FooterLinks header="COMPANY" :links="[{ label: 'About' }, { label: 'Careers' }]" />
            <FooterLinks header="HELP"
                :links="[{ label: 'Customer Support' }, { label: 'Terms & Conditions' }, { label: 'Privacy Policy' }]" />
            <FooterLinks header="FAQ" :links="[{ label: 'Account' }, { label: 'Orders' }, { label: 'Payments' }]" />
            <FooterLinks header="FOLLOW US" :links="[
                { label: 'Instagram' },
                { label: 'TikTok' },
                { label: 'Twitter' }
            ]" />
        </div>
        <div class="wrapper">
            <div class="footer-bottom">
                <div class="subtitle-m light">
                    <span class="logo">LOVE.CO</span> &copy; {{ new Date().getFullYear() }}. All Rights Reserved
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.footer-container {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    width: 100vw;
    overflow-x: hidden;
}

.newsletter-container {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 40px 70px;
    box-sizing: border-box;
    background-color: #000000;
    border-radius: 25px;
    width: 85%;
    gap: 25px;
}

.logo-container {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 25px;
}

.header {
    color: var(--text-3);
}

.newsletter-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    width: 45%;
}

.background {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--secondary-3);
    width: 100vw;
    height: 50%;
    bottom: 0;
    z-index: -1;
}

.email-field {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.footer-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
    flex-wrap: wrap;
    padding: 50px 7.5%;
    width: 100%;
    box-sizing: border-box;
    gap: 35px;
    background-color: var(--secondary-3);
}

.footer-bottom {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    padding: 25px 0px 75px;
    width: 85%;
    border-top: 1px solid #00000020;
    box-sizing: border-box;
    background-color: var(--secondary-3);
}

.wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: var(--secondary-3);
}

.logo {
    font-family: 'Integral CF';
    font-weight: 700;
    cursor: pointer;
}

@media (max-width: 960px) {
    .newsletter-container {
        flex-direction: column;
        padding: 40px 50px;
        width: 90%;
    }

    .header {
        width: 100%;
    }

    .newsletter-content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        width: 100%;
    }

    .newsletter-button {
        width: 50% !important;
    }

    .email-field {
        height: 55px;
    }
}

@media (max-width: 768px) {
    .footer-content {
        justify-content: start;
        gap: 50px;
    }

    .newsletter-content {
        flex-direction: column;
    }

    .newsletter-button {
        width: 100% !important;
    }

    .newsletter-container {
        width: 85%;
    }
}

@media (max-width: 425px) {
    .email-field {
        height: 45px;
    }

    .newsletter-container {
        padding: 35px 35px;
        width: 95%;
    }
}
</style>