import type { APIRoute } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

async function loadFont(): Promise<ArrayBuffer> {
  const res = await fetch(
    "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf"
  );
  return res.arrayBuffer();
}

async function loadSerifFont(): Promise<ArrayBuffer> {
  const res = await fetch(
    "https://fonts.gstatic.com/s/instrumentserif/v5/jizHRFtNs2ka5fXjeivQ4LroWlx-6zATiw.ttf"
  );
  return res.arrayBuffer();
}

export const GET: APIRoute = async () => {
  const [sansFont, serifFont] = await Promise.all([loadFont(), loadSerifFont()]);

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "linear-gradient(135deg, #1a1a18 0%, #2a2826 100%)",
          fontFamily: "Inter",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "14px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: "10px",
                      height: "10px",
                      background: "#c43d2e",
                      borderRadius: "999px",
                    },
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "22px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "#c43d2e",
                    },
                    children: "Daily · Structured · Unflinching",
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "28px",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "200px",
                      fontFamily: "Instrument Serif",
                      fontStyle: "italic",
                      lineHeight: 0.95,
                      color: "#fafaf8",
                      letterSpacing: "-0.02em",
                    },
                    children: "Blindspot",
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      borderLeft: "4px solid #c43d2e",
                      paddingLeft: "24px",
                      fontSize: "44px",
                      fontFamily: "Instrument Serif",
                      fontStyle: "italic",
                      lineHeight: 1.25,
                      color: "#a0a098",
                    },
                    children: "See what you're missing.",
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "24px",
                      color: "#666660",
                    },
                    children: "blindspot.news",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      fontSize: "22px",
                      fontWeight: 600,
                      color: "#c43d2e",
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                    },
                    children: "A council of simulated philosophers",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: sansFont, weight: 400, style: "normal" },
        { name: "Inter", data: sansFont, weight: 600, style: "normal" },
        { name: "Instrument Serif", data: serifFont, weight: 400, style: "normal" },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
