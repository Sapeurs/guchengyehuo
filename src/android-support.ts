import './android.css';

type NativeHooks={back:()=>boolean;pause:()=>void;resume:()=>void};
declare global {interface Window {guchengNative?:NativeHooks}}

export const isAndroidApp=()=>location.hostname==='appassets.androidplatform.net'&&navigator.userAgent.includes('GuchengNightfire/');

/** The packaged build uses a fixed local HTTPS origin, never the hosted Site. */
export function installAndroidSupport(hooks:NativeHooks){
 if(!isAndroidApp())return;
 document.documentElement.classList.add('android-game');
 window.guchengNative=hooks;
 document.addEventListener('visibilitychange',()=>document.hidden?hooks.pause():hooks.resume());
}
