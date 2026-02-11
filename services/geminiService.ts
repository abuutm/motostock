
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Sale } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getInventoryInsights(products: Product[], sales: Sale[]) {
  const prompt = `
    Fanya kazi kama mchambuzi mkuu wa biashara kwa duka la pikipiki. 
    Chambua data ifuatayo ya bidhaa na mauzo:
    
    Bidhaa: ${JSON.stringify(products.map(p => ({ name: p.name, stock: p.stockQuantity, reorder: p.reorderLevel, price: p.sellingPrice })))}
    Mauzo ya Hivi Karibuni: ${JSON.stringify(sales.slice(-10).map(s => ({ total: s.grandTotal, items: s.items.length, date: s.date })))}
    
    Toa:
    1. Muhtasari wa hali ya stoo kwa sasa.
    2. Bidhaa maalum zinazohitaji kuagizwa haraka.
    3. Mwelekeo wa mapato na mapendekezo ya ukuaji wa biashara.
    4. Pendekezo la bidhaa "shujaa" (Hero product) ya kuifanyia matangazo zaidi.
    
    Tafadhali toa majibu yako yote kwa lugha ya KISWAHILI fasaha ukitumia muundo wa markdown wenye vichwa vya habari.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Imeshindikana kupata uchambuzi kwa sasa. Tafadhali jaribu tena baadaye.";
  }
}

export async function getBusinessGrowthTips(products: Product[], sales: Sale[]) {
  const prompt = `
    Wewe ni "Business Pro AI", mshauri bingwa wa biashara za pikipiki na vipuri.
    Kulingana na data hizi:
    - Jumla ya bidhaa: ${products.length}
    - Thamani ya stoo: ${products.reduce((acc, p) => acc + (p.costPrice * p.stockQuantity), 0)}
    - Idadi ya mauzo ya hivi karibuni: ${sales.length}

    Toa ushauri mmoja mfupi, wenye nguvu, na wa kiubunifu (proactive advice) wa kukuza faida ya duka hili leo. 
    Ushauri uwe wa vitendo (actionable).
    
    Lugha: KISWAHILI. 
    Muundo: Sentensi 2-3 tu. Uwe na mtazamo wa kishujaa na wa kibiashara (professional & energetic).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Growth Tip Error:", error);
    return "Ongeza huduma kwa wateja na hakikisha bidhaa muhimu hazikosekani stoo ili kukuza mauzo yako leo!";
  }
}
