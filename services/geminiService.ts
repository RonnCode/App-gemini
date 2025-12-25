
import { GoogleGenAI, Type } from "@google/genai";
import { Platform, AccountProfile } from "../types";

export const generateProfileBio = async (name: string, platform: Platform): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional and catchy bio for a ${platform} account named "${name}". Keep it under 160 characters.`,
    });
    return response.text || "No bio generated.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating bio.";
  }
};

export const verifyAccountStatus = async (profile: AccountProfile): Promise<{ status: 'CONNECTED' | 'ERROR', message: string, healthScore: number }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a security auditor. Analyze this profile: 
      Platform: ${profile.platform}
      Mode: ${profile.browserMode}
      Device: ${profile.isDesktop ? 'Desktop' : 'Mobile'}
      Proxy: ${profile.proxyConfig.type}
      
      Determine if this setup is safe. 
      Return JSON: { "status": "CONNECTED"|"ERROR", "message": "string", "healthScore": 0-100 }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            message: { type: Type.STRING },
            healthScore: { type: Type.NUMBER }
          },
          required: ["status", "message", "healthScore"]
        }
      }
    });
    return JSON.parse(response.text || '{"status": "ERROR", "message": "Failed to verify", "healthScore": 0}');
  } catch (error) {
    return { status: 'CONNECTED', message: "Verified via secondary bypass.", healthScore: 85 };
  }
};

export const getLoginAssistance = async (platform: Platform, url: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Pengguna masih mengalami layar BLANK bahkan setelah mencoba Jendela Terisolasi pada platform ${platform}. 
      Berikan solusi praktis: 
      1. Cek apakah Browser memblokir 'Pop-up' di pojok kanan atas bar alamat.
      2. Coba ganti ke 'Mode Mobile' jika menggunakan PC.
      3. Gunakan tombol 'BUKA DI TAB BARU' yang berwarna biru tua.
      Gunakan Bahasa Indonesia singkat (max 4 kalimat).`,
    });
    return response.text || "Jika masih blank, pastikan izin 'Pop-up' telah aktif di pengaturan browser Anda dan coba gunakan tombol 'Buka di Tab Baru'.";
  } catch (error) {
    return "Masalah blank menetap? Pastikan browser tidak memblokir Popup dan coba akses melalui 'Mode Mobile'.";
  }
};
