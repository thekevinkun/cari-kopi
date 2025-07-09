"use client";

import L from "leaflet";

import type { Shop } from "@/types";

import { getStarsSVG } from "@/utils/helpers";

export function createShopMarkerIcon(
  shop: Shop,
  isMobile: boolean,
  delay?: number,
  hasMounted?: boolean,
  isDestination?: boolean
): L.DivIcon {
  const fadeDuration = 0.3;
  const fadeDelay = delay?.toFixed(2);

  const html = `
    <div 
      style="
        background: white;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: ${isMobile ? 85 : 100}px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        border-radius: 8px;
        line-height: 1.2;
        animation: ${hasMounted ? `fadeInUp ${fadeDuration}s ease-out ${fadeDelay}s forwards` : "none"};
        opacity: ${hasMounted ? 0 : 1};
        transform: translateY(10px);
        cursor: auto;
      "
    >
      <strong 
        title="${shop.name}";
        class="${!isDestination ? "shop-title" : ""}";
        style=" 
          margin-top: ${isMobile ? 4 : 10}px;
          margin-bottom: ${isMobile ? 10 : 15}px;
          font-size: ${isMobile ? "0.585rem" : "0.685rem"};
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        "
      >
        ${shop.name}
      </strong>

      <div style="position: relative; width: 100%; height: ${
        isMobile ? 56 : 72
      }px; margin-bottom: 10px;">
        <img
          title="${shop.name}";
          src="${shop.thumbnail}";
          alt="${shop.name}";
          class="${!isDestination ? "shop-image" : ""}";
          style="width: 100%; height: ${
            isMobile ? 56 : 72
          }px; object-fit: cover; display: block;"
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

        .shop-title:hover {
          text-decoration: underline;
          cursor: pointer;
        }

        .shop-image:hover {
          filter: brightness(1.08);
          transition: filter 0.2s ease;
          cursor: pointer;
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
