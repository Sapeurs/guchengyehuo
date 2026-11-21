const paths:Record<string,string>={
  book:'<path d="M3 4h7a3 3 0 0 1 2 1 3 3 0 0 1 2-1h7v15h-7a3 3 0 0 0-2 1 3 3 0 0 0-2-1H3Z"/><path d="M12 5v15M6 8h3M6 12h3M15 8h3M15 12h3"/>',
  eye:'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  sound:'<path d="m3 9 5 0 5-4v14l-5-4H3ZM17 8a6 6 0 0 1 0 8M20 5a10 10 0 0 1 0 14"/>',
  muted:'<path d="m3 9 5 0 5-4v14l-5-4H3ZM17 9l5 6m0-6-5 6"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  close:'<path d="m6 6 12 12M18 6 6 18"/>',
  arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
  back:'<path d="M20 12H5m6-6-6 6 6 6"/>',
  check:'<path d="m5 12 4 4L20 5"/>',
  help:'<path d="M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 3M12 17v.2"/><circle cx="12" cy="12" r="10"/>',
  bag:'<path d="M6 7h12l3 13H3ZM8 7V5a4 4 0 0 1 8 0v2M9 13h6"/>',
  candle:'<path d="M9 10h6v10H9ZM6 21h12M12 2c-5 5-2 7 0 6 3 0 3-3 0-6Z"/>',
  key:'<circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-4-4 3-3m-6 0 3-3"/>',
  tag:'<path d="M8 4h8l3 5v12H5V9Z"/><circle cx="12" cy="8" r="1"/><path d="M9 13h6M9 17h6M12 4V1"/>',
  cloth:'<path d="m5 4 15 2-3 15-14-3ZM5 8l13 2M5 13l12 2"/>',
  wetcloth:'<path d="m5 6 13 2-2 13L3 18ZM19 1c-5 6 3 7 0 0Z"/>',
  paper:'<path d="M5 2h10l4 4v16H5ZM15 2v5h4M8 11h8M8 15h8M8 19h5"/>',
  full:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  save:'<path d="M4 3h14l3 3v15H3V3ZM7 3v6h10V3M7 21v-8h10v8"/>',
  戈:'<path d="M12 8v14M12 1 9 8h6ZM10 11h4"/>',
  铳:'<path d="m5 20 3-5-3-2 3-3 3 2L20 3l2 2-10 10-3 7ZM13 10l3 3M15 8l3 3"/>',
  弓:'<path d="M7 2c14 5 14 15 0 20l5-10ZM4 12h18m-4-4 4 4-4 4"/>',
  盾:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="3"/><path d="M5 6l14 12M5 18 19 6"/>'
};
export const icon=(name:string,cls='')=>`<svg class="icon ${cls}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.paper}</svg>`;
export const itemIcon=(name:string)=>icon(({manifest:'paper',order:'paper'} as Record<string,string>)[name]||name);
