import { readFileSync } from 'fs';
const pdfPath = "C:\\Users\\JUANPABLOÁNGEL\\Downloads\\Manual de identidad Segovia.pdf";
const buf = readFileSync(pdfPath);
const str = buf.toString('binary');

// Hex colors
const hexRe = /#[0-9A-Fa-f]{6}/g;
const hexColors = new Set();
let hm;
while((hm=hexRe.exec(str))!==null) hexColors.add(hm[0].toUpperCase());
console.log('=HEX COLORS=');
[...hexColors].forEach(c=>console.log(c));

// CMYK -> RGB
const cmykRe = /(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+k/g;
const cmykUniq = new Set();
let m;
while((m=cmykRe.exec(str))!==null){
  const [C,M,Y,K]=[m[1],m[2],m[3],m[4]].map(Number);
  if(C>0||M>0||Y>0){
    const r=Math.round(255*(1-C)*(1-K));
    const g=Math.round(255*(1-M)*(1-K));
    const b=Math.round(255*(1-Y)*(1-K));
    const hex='#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
    cmykUniq.add(hex+'  cmyk('+[C,M,Y,K].join(',')+')');
  }
}
console.log('\n=CMYK->RGB=');
[...cmykUniq].slice(0,50).forEach(c=>console.log(c));

// RGB normalized (PDF rg operator, values 0-1)
const rgbRe = /(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+rg/g;
const rgbUniq = new Set();
let rm;
while((rm=rgbRe.exec(str))!==null){
  const [R,G,B]=[rm[1],rm[2],rm[3]].map(Number);
  if(R<=1&&G<=1&&B<=1&&(R>0||G>0||B>0)){
    const r=Math.round(R*255), g=Math.round(G*255), b=Math.round(B*255);
    const hex='#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase();
    rgbUniq.add(hex+'  rgb('+[R,G,B].join(',')+')');
  }
}
console.log('\n=PDF RGB->HEX=');
[...rgbUniq].slice(0,50).forEach(c=>console.log(c));

// Fonts
const fontRe = /\/BaseFont\s*\/([^\s\/]+)/g;
const fonts = new Set();
let fm;
while((fm=fontRe.exec(str))!==null) fonts.add(fm[1]);
console.log('\n=FONTS=');
[...fonts].forEach(f=>console.log(f));
