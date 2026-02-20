"use client";

import React from "react";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";
import { socialMedia } from "@/data";
import { useLanguage } from "@/context/language-context";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full pb-10 mb-[100px] md:mb-5" id="contact">
      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          {t.footer.title.split(t.footer.highlightedWord)[0]}
          <span className="text-purple">{t.footer.highlightedWord}</span>
          {t.footer.title.split(t.footer.highlightedWord)[1]}
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">{t.footer.description}</p>
        <a href="mailto:andremrguerra@gmail.com">
          <MagicButton title={t.footer.cta} icon={<FaLocationArrow />} position="right" />
        </a>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
        <p className="md:text-base text-sm md:font-normal font-light">{t.footer.copyright}</p>
        <div className="flex items-center md:gap-3 gap-6 ">
          {socialMedia.map((profile) => (
            <a
              key={profile.id}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 cursor-pointer flex justify-center items-center
                            backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200
                            rounded-lg border border-black-300"
            >
              <img src={profile.img} alt={profile.img} width={20} height={20} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
