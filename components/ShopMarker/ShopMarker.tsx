"use client"

import L from "leaflet";

import type { Shop } from "@/types";

import { getStarsSVG } from "@/utils/helpers";

export function createShopMarkerIcon(shop: Shop, isMobile: boolean, delay?: number): L.DivIcon {
  const fadeDuration = 0.3;
  const fadeDelay = delay?.toFixed(2);

  const html = `
    <div 
      title="${shop.name}"
      style="
        background: white;
        padding: ${isMobile ? "8px" : "10px"};
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: ${isMobile ? 82 : 100}px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        border-radius: 8px;
        line-height: 1.2;
        animation: fadeInUp ${fadeDuration}s ease-out ${fadeDelay}s forwards;
        opacity: 0;
        transform: "translateY(10px)";
      "
    >
      <strong 
        style=" 
          margin-top: ${isMobile ? 4 : 10}px;
          margin-bottom: ${isMobile ? 10 : 15}px;
          font-size: ${isMobile ? "0.55rem" : "0.685rem"};
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        "
      >
        ${shop.name}
      </strong>

      <div style="position: relative; width: 100%; height: ${isMobile ? 54 : 72}px; margin-bottom: ${isMobile ? 7 : 10}px;">
        <img
          src="${shop.thumbnail}"
          alt="${shop.name}"
          style="width: 100%; height: ${isMobile ? 54 : 72}px; object-fit: cover; display: block;"
          onload="if (this.nextElementSibling) this.nextElementSibling.style.display='none'"
          onerror="if (this.nextElementSibling) this.nextElementSibling.style.display='none'; this.src='/no-coffee-image.jpg'"
        />

        <div class="spinner" style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: ${isMobile ? 18 : 24}px;
          height: ${isMobile ? 18 : 24}px;
          border: 2px solid #6f91d1;
          border-top: 2px solid #ccc;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        "></div>
      </div>

      <span>${getStarsSVG(shop.rating, isMobile)}</span>

      <style>
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      </style>
    </div>
  `;

  return L.divIcon({
    html,
    className: "",
    iconAnchor: [60, 90],
  });
}