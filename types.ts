
export interface GenerationParams {
  logo?: string; // base64
  logoMimeType?: string;
  backgroundPrompt: string;
  mainText: string;
  subText: string;
  mainTextColor: string;
  subTextColor: string;
  textPosition: string;
  textStyle: string;
}

export interface GeneratedImage {
  url: string;
  timestamp: number;
}
