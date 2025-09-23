import{c as m,a as d}from"./index-f6D6TMGS.js";/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function W(){const t={resolve:null,promise:null};return t.promise=new Promise(e=>{t.resolve=e}),t}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function N(t,{timeOutAfter:e=500,retryAfter:r=100}={}){return new Promise((n,o)=>{const c=Date.now();let s=null;const i=setTimeout(()=>{o(s??new Error("Timeout"))},e),a=async()=>{try{const f=await t();clearTimeout(i),n(f)}catch(f){s=f,Date.now()-c>e?o(f):setTimeout(a,r)}};a()})}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const p=new Map;function S(t,{attributes:e}={}){if(p.has(t))return p.get(t);const r=document.querySelector(`script[src="${t}"]`);r&&(console.warn(`Script with "${t}" src is already present in DOM!`),r.remove());const n=new Promise((o,c)=>{const s=document.createElement("script");s.onerror=c,s.onload=()=>{o()};for(const[a,f]of Object.entries(e||{}))s.setAttribute(a,f);s.setAttribute("data-injected-by","ckeditor-integration"),s.type="text/javascript",s.async=!0,s.src=t,document.head.appendChild(s);const i=new MutationObserver(a=>{a.flatMap(h=>Array.from(h.removedNodes)).includes(s)&&(p.delete(t),i.disconnect())});i.observe(document.head,{childList:!0,subtree:!0})});return p.set(t,n),n}async function I(t,e){await Promise.all(t.map(r=>S(r,e)))}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const g=new Map;function U({href:t,placementInHead:e="start",attributes:r={}}){if(g.has(t))return g.get(t);const n=document.querySelector(`link[href="${t}"][rel="stylesheet"]`);n&&(console.warn(`Stylesheet with "${t}" href is already present in DOM!`),n.remove());const o=s=>{const i=Array.from(document.head.querySelectorAll('link[data-injected-by="ckeditor-integration"]'));switch(e){case"start":i.length?i.slice(-1)[0].after(s):document.head.insertBefore(s,document.head.firstChild);break;case"end":document.head.appendChild(s);break}},c=new Promise((s,i)=>{const a=document.createElement("link");for(const[h,v]of Object.entries(r||{}))a.setAttribute(h,v);a.setAttribute("data-injected-by","ckeditor-integration"),a.rel="stylesheet",a.href=t,a.onerror=i,a.onload=()=>{s()},o(a);const f=new MutationObserver(h=>{h.flatMap(B=>Array.from(B.removedNodes)).includes(a)&&(g.delete(t),f.disconnect())});f.observe(document.head,{childList:!0,subtree:!0})});return g.set(t,c),c}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function z(){return typeof window>"u"}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function F(t){let e=null;return(...r)=>(e||(e={current:t(...r)}),e.current)}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function q(t,{attributes:e}={}){if(document.head.querySelector(`link[href="${t}"][rel="preload"]`))return;const r=document.createElement("link");for(const[n,o]of Object.entries(e||{}))r.setAttribute(n,o);r.setAttribute("data-injected-by","ckeditor-integration"),r.rel="preload",r.as=H(t),r.href=t,document.head.insertBefore(r,document.head.firstChild)}function H(t){switch(!0){case/\.css$/.test(t):return"style";case/\.js$/.test(t):return"script";default:return"fetch"}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function G(t,e){if(t===e)return!0;if(!t||!e)return!1;for(let r=0;r<t.length;++r)if(t[r]!==e[r])return!1;return!0}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const u=new Array(256).fill("").map((t,e)=>("0"+e.toString(16)).slice(-2));function P(){const[t,e,r,n]=crypto.getRandomValues(new Uint32Array(4));return"e"+u[t>>0&255]+u[t>>8&255]+u[t>>16&255]+u[t>>24&255]+u[e>>0&255]+u[e>>8&255]+u[e>>16&255]+u[e>>24&255]+u[r>>0&255]+u[r>>8&255]+u[r>>16&255]+u[r>>24&255]+u[n>>0&255]+u[n>>8&255]+u[n>>16&255]+u[n>>24&255]}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function E(t){return Array.from(new Set(t))}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */async function y(t,e){const r=()=>t.map(n=>window[n]).filter(Boolean)[0];return N(()=>{const n=r();if(!n)throw new Error(`Window entry "${t.join(",")}" not found.`);return n},e)}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function J(t,e){const r=Object.entries(t).filter(([n,o])=>e(o,n));return Object.fromEntries(r)}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function Y(t){return J(t,e=>e!=null)}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function K(t,e){const r=Object.entries(t).map(([n,o])=>[n,e(o,n)]);return Object.fromEntries(r)}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function b(t,e){return e.filter(r=>!t.includes(r))}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function X(t,e){const r=t.extraPlugins||[];return{...t,extraPlugins:[...r,...e.filter(n=>!r.includes(n))]}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function _(t){return!!t&&/^\d+\.\d+\.\d+/.test(t)}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function C(t){return t?["nightly","alpha","internal","nightly-","staging"].some(e=>t.includes(e)):!1}function Q(t){return _(t)||C(t)}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function x(t){if(!_(t))throw new Error(`Invalid semantic version: ${t||"<blank>"}.`);const[e,r,n]=t.split(".");return{major:Number.parseInt(e,10),minor:Number.parseInt(r,10),patch:Number.parseInt(n,10)}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function D(t){if(C(t))return 3;const{major:e}=x(t);switch(!0){case e>=44:return 3;case e>=38:return 2;default:return 1}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function j(){const{CKEDITOR_VERSION:t,CKEDITOR:e}=window;return Q(t)?{source:e?"cdn":"npm",version:t}:null}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function Z(){const t=j();return t?D(t.version):null}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function O(t,e){switch(e||(e=Z()||void 0),e){case 1:case 2:return t===void 0;case 3:return t==="GPL";default:return!1}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function ee(t,e){return function(n){O(n.config.get("licenseKey"))||n.on("collectUsageData",(o,{setUsageData:c})=>{c(`integration.${t}`,e)})}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const te="https://cdn.ckeditor.com";function T(t,e,r){return`${te}/${t}/${r}/${e}`}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const re="https://cdn.ckbox.io";function ne(t,e,r){return`${re}/${t}/${r}/${e}`}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const oe="https://ckeditor.com/docs/ckeditor5";function se(t,e="latest"){return`${oe}/${e}/${t}`}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function ie({version:t,translations:e,createCustomCdnUrl:r=T}){const n={scripts:[r("ckeditor5","ckeditor5.umd.js",t),...b(["en"],e||[]).map(o=>r("ckeditor5",`translations/${o}.umd.js`,t))],stylesheets:[r("ckeditor5","ckeditor5.css",t)]};return{preload:[...n.stylesheets,...n.scripts],scripts:[async o=>I(n.scripts,o)],stylesheets:n.stylesheets,checkPluginLoaded:async()=>y(["CKEDITOR"]),beforeInject:()=>{const o=j();switch(o==null?void 0:o.source){case"npm":throw new Error("CKEditor 5 is already loaded from npm. Check the migration guide for more details: "+se("updating/migration-to-cdn/vanilla-js.html"));case"cdn":if(o.version!==t)throw new Error(`CKEditor 5 is already loaded from CDN in version ${o.version}. Remove the old <script> and <link> tags loading CKEditor 5 to allow loading the ${t} version.`);break}}}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function ae({version:t,translations:e,createCustomCdnUrl:r=T}){const n={scripts:[r("ckeditor5-premium-features","ckeditor5-premium-features.umd.js",t),...b(["en"],e||[]).map(o=>r("ckeditor5-premium-features",`translations/${o}.umd.js`,t))],stylesheets:[r("ckeditor5-premium-features","ckeditor5-premium-features.css",t)]};return{preload:[...n.stylesheets,...n.scripts],scripts:[async o=>I(n.scripts,o)],stylesheets:n.stylesheets,checkPluginLoaded:async()=>y(["CKEDITOR_PREMIUM_FEATURES"])}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */async function ce(t){let{htmlAttributes:e={},scripts:r=[],stylesheets:n=[],preload:o,beforeInject:c,checkPluginLoaded:s}=k(t);c==null||c(),o||(o=E([...n.filter(i=>typeof i=="string"),...r.filter(i=>typeof i=="string")]));for(const i of o)q(i,{attributes:e});await Promise.all(E(n).map(i=>U({href:i,attributes:e,placementInHead:"start"})));for(const i of E(r)){const a={attributes:e};typeof i=="string"?await S(i,a):await i(a)}return s==null?void 0:s()}function k(t){return Array.isArray(t)?{scripts:t.filter(e=>typeof e=="function"||e.endsWith(".js")),stylesheets:t.filter(e=>e.endsWith(".css"))}:typeof t=="function"?{checkPluginLoaded:t}:t}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function L(t){const e=K(Y(t),k);return{...Object.values(e).reduce((c,s)=>(c.scripts.push(...s.scripts??[]),c.stylesheets.push(...s.stylesheets??[]),c.preload.push(...s.preload??[]),c),{preload:[],scripts:[],stylesheets:[]}),beforeInject:()=>{var c;for(const s of Object.values(e))(c=s.beforeInject)==null||c.call(s)},checkPluginLoaded:async()=>{var s;const c=Object.create(null);for(const[i,a]of Object.entries(e))c[i]=await((s=a==null?void 0:a.checkPluginLoaded)==null?void 0:s.call(a));return c}}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function ue(){var e;const t=(e=window.CKBox)==null?void 0:e.version;return _(t)?{source:"cdn",version:t}:null}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function le({version:t,theme:e="lark",translations:r,createCustomCdnUrl:n=ne}){return{scripts:[n("ckbox","ckbox.js",t),...b(["en"],r||[]).map(o=>n("ckbox",`translations/${o}.js`,t))],...e&&{stylesheets:[n("ckbox",`styles/themes/${e}.css`,t)]},checkPluginLoaded:async()=>y(["CKBox"]),beforeInject:()=>{const o=ue();if(o&&o.version!==t)throw new Error(`CKBox is already loaded from CDN in version ${o.version}. Remove the old <script> and <link> tags loading CKBox to allow loading the ${t} version.`)}}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function de(t){if(C(t))return!0;const{major:e}=x(t);switch(D(t)){case 3:return!0;default:return e===43}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function fe(t){const e=K(t,(r,n)=>{if(!r)return;const o=k(r);return{checkPluginLoaded:async()=>y([n]),...o}});return L(e)}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function he(t){const{version:e,translations:r,plugins:n,premium:o,ckbox:c,createCustomCdnUrl:s,injectedHtmlElementsAttributes:i={crossorigin:"anonymous"}}=t;me(e);const a=L({CKEditor:ie({version:e,translations:r,createCustomCdnUrl:s}),...o&&{CKEditorPremiumFeatures:ae({version:e,translations:r,createCustomCdnUrl:s})},...c&&{CKBox:le(c)},loadedPlugins:fe(n??{})});return ce({...a,htmlAttributes:i})}function me(t){if(C(t)&&console.warn("You are using a testing version of CKEditor 5. Please remember that it is not suitable for production environments."),!de(t))throw new Error(`The CKEditor 5 CDN can't be used with the given editor version: ${t}. Please make sure you are using at least the CKEditor 5 version 44.`)}var pe=Object.defineProperty,ge=(t,e,r)=>e in t?pe(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,l=(t,e,r)=>ge(t,typeof e!="symbol"?e+"":e,r);/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const A=class M{constructor(e,r){l(this,"_lifecycle"),l(this,"_element"),l(this,"_releaseLock",null),l(this,"_value",null),l(this,"_afterMountCallbacks",[]),l(this,"_state",{destroyedBeforeInitialization:!1,mountingInProgress:null}),l(this,"release",F(()=>{const{_releaseLock:n,_state:o,_element:c,_lifecycle:s}=this;o.mountingInProgress?o.mountingInProgress.then(()=>s.unmount({element:c,mountResult:this.value})).catch(i=>{console.error("Semaphore unmounting error:",i)}).then(n.resolve).then(()=>{this._value=null}):(o.destroyedBeforeInitialization=!0,n.resolve())})),this._element=e,this._lifecycle=r,this._lock()}get value(){return this._value}unsafeSetValue(e){this._value=e,this._afterMountCallbacks.forEach(r=>r(e)),this._afterMountCallbacks=[]}runAfterMount(e){const{_value:r,_afterMountCallbacks:n}=this;r?e(r):n.push(e)}_lock(){const{_semaphores:e}=M,{_state:r,_element:n,_lifecycle:o}=this,c=e.get(n)||Promise.resolve(null),s=W();this._releaseLock=s;const i=c.then(()=>r.destroyedBeforeInitialization?Promise.resolve(void 0):(r.mountingInProgress=o.mount().then(a=>(a&&this.unsafeSetValue(a),a)),r.mountingInProgress)).then(async a=>{a&&o.afterMount&&await o.afterMount({element:n,mountResult:a})}).then(()=>s.promise).catch(a=>{console.error("Semaphore mounting error:",a)}).then(()=>{e.get(n)===i&&e.delete(n)});e.set(n,i)}};l(A,"_semaphores",new Map);let ye=A;/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const Ce="$__CKEditorReactContextMetadata";function Ee(t,e){return{...e,[Ce]:t}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const we=t=>{const e=d.useRef();return e.current=t,d.useCallback((...r)=>e.current(...r),[])};/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const be=m.createContext(null),_e=t=>!!t&&typeof t=="object"&&"status"in t&&["initializing","initialized","error"].includes(t.status),$=t=>e=>_e(e)&&e.status===t,R=$("initializing"),ke=t=>$("initialized")(t)&&t.watchdog.state==="ready";/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const ve=ee("react",{version:"9.5.0",frameworkVersion:m.version});/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function Re(t){return O(t.licenseKey)?t:X(t,[ve])}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const w="Lock from React integration (@ckeditor/ckeditor5-react)";class Se extends m.Component{constructor(e){super(e),l(this,"domContainer",m.createRef()),l(this,"editorSemaphore",null),this._checkVersion()}_checkVersion(){const{CKEDITOR_VERSION:e}=window;if(!e)return console.warn('Cannot find the "CKEDITOR_VERSION" in the "window" scope.');const[r]=e.split(".").map(Number);r>=42||e.startsWith("0.0.0")||console.warn("The <CKEditor> component requires using CKEditor 5 in version 42+ or nightly build.")}get _semaphoreValue(){const{editorSemaphore:e}=this;return e?e.value:null}get watchdog(){const{_semaphoreValue:e}=this;return e?e.watchdog:null}get editor(){const{_semaphoreValue:e}=this;return e?e.instance:null}shouldComponentUpdate(e){const{props:r,editorSemaphore:n}=this;return e.id!==r.id||e.disableWatchdog!==r.disableWatchdog?!0:(n&&(n.runAfterMount(({instance:o})=>{this._shouldUpdateEditorData(r,e,o)&&o.data.set(e.data)}),"disabled"in e&&n.runAfterMount(({instance:o})=>{e.disabled?o.enableReadOnlyMode(w):o.disableReadOnlyMode(w)})),!1)}componentDidMount(){R(this.context)||this._initLifeCycleSemaphore()}componentDidUpdate(){R(this.context)||this._initLifeCycleSemaphore()}componentWillUnmount(){this._unlockLifeCycleSemaphore()}_unlockLifeCycleSemaphore(){this.editorSemaphore&&(this.editorSemaphore.release(),this.editorSemaphore=null)}_initLifeCycleSemaphore(){this._unlockLifeCycleSemaphore(),this.editorSemaphore=new ye(this.domContainer.current,{mount:async()=>this._initializeEditor(),afterMount:({mountResult:e})=>{const{onReady:r}=this.props;r&&this.domContainer.current!==null&&r(e.instance)},unmount:async({element:e,mountResult:r})=>{const{onAfterDestroy:n}=this.props;try{await this._destroyEditor(r),e.innerHTML=""}finally{n&&n(r.instance)}}})}render(){return m.createElement("div",{ref:this.domContainer})}async _initializeEditor(){if(this.props.disableWatchdog)return{instance:await this._createEditor(this.domContainer.current,this._getConfig()),watchdog:null};const e=ke(this.context)?new Ie(this.context.watchdog):new this.props.editor.EditorWatchdog(this.props.editor,this.props.watchdogConfig),r={current:0};return e.setCreator(async(n,o)=>{var c;const{editorSemaphore:s}=this,{onAfterDestroy:i}=this.props;r.current>0&&i&&((c=s==null?void 0:s.value)!=null&&c.instance)&&i(s.value.instance);const a=await this._createEditor(n,o);return s&&r.current>0&&(s.unsafeSetValue({instance:a,watchdog:e}),setTimeout(()=>{this.props.onReady&&this.props.onReady(e.editor)})),r.current++,a}),e.on("error",(n,{error:o,causesRestart:c})=>{(this.props.onError||console.error)(o,{phase:"runtime",willEditorRestart:c})}),await e.create(this.domContainer.current,this._getConfig()).catch(n=>{(this.props.onError||console.error)(n,{phase:"initialization",willEditorRestart:!1})}),{watchdog:e,instance:e.editor}}_createEditor(e,r){const{contextItemMetadata:n}=this.props;return n&&(r=Ee(n,r)),this.props.editor.create(e,Re(r)).then(o=>{if("disabled"in this.props){/* istanbul ignore else -- @preserve */this.props.disabled&&o.enableReadOnlyMode(w)}const c=o.model.document,s=o.editing.view.document;return c.on("change:data",i=>{/* istanbul ignore else -- @preserve */this.props.onChange&&this.props.onChange(i,o)}),s.on("focus",i=>{/* istanbul ignore else -- @preserve */this.props.onFocus&&this.props.onFocus(i,o)}),s.on("blur",i=>{/* istanbul ignore else -- @preserve */this.props.onBlur&&this.props.onBlur(i,o)}),o})}async _destroyEditor(e){const{watchdog:r,instance:n}=e;return new Promise((o,c)=>{/* istanbul ignore next -- @preserve */setTimeout(async()=>{try{if(r)return await r.destroy(),o();if(n)return await n.destroy(),o();o()}catch(s){console.error(s),c(s)}})})}_shouldUpdateEditorData(e,r,n){return!(e.data===r.data||n.data.get()===r.data)}_getConfig(){const e=this.props.config||{};return this.props.data&&e.initialData&&console.warn("Editor data should be provided either using `config.initialData` or `content` property. The config value takes precedence over `content` property and will be used when both are specified."),{...e,initialData:e.initialData||this.props.data||""}}}l(Se,"contextType",be);class Ie{constructor(e){l(this,"_contextWatchdog"),l(this,"_id"),l(this,"_creator"),this._contextWatchdog=e,this._id=P()}setCreator(e){this._creator=e}create(e,r){return this._contextWatchdog.add({sourceElementOrData:e,config:r,creator:this._creator,id:this._id,type:"editor"})}on(e,r){this._contextWatchdog.on("itemError",(n,{itemId:o,error:c})=>{o===this._id&&r(null,{error:c,causesRestart:void 0})})}destroy(){return this._contextWatchdog.state==="ready"?this._contextWatchdog.remove(this._id):Promise.resolve()}get editor(){return this._contextWatchdog.getItem(this._id)}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function V(...t){return e=>{t.forEach(r=>{typeof r=="function"?r(e):r!=null&&(r.current=e)})}}/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const Pe=(t,e)=>{const[r,n]=d.useState(null);G(r,e)||(t(),n([...e]))},Ke=d.memo(d.forwardRef(({id:t,semaphore:e,rootName:r},n)=>{const o=d.useRef(null);return d.useEffect(()=>{let c,s;return e.runAfterMount(({instance:i})=>{if(!o.current)return;s=i;const{ui:a,model:f}=s,h=f.document.getRoot(r);h&&s.ui.getEditableElement(r)&&s.detachEditable(h),c=a.view.createEditable(r,o.current),a.addEditable(c),i.editing.view.forceRender()}),()=>{if(s&&s.state!=="destroyed"&&o.current){const i=s.model.document.getRoot(r);/* istanbul ignore else -- @preserve */i&&s.detachEditable(i)}}},[e.revision]),m.createElement("div",{key:e.revision,id:t,ref:V(n,o)})}));Ke.displayName="EditorEditable";const xe=d.forwardRef(({editor:t},e)=>{const r=d.useRef(null);return d.useEffect(()=>{const n=r.current;if(!t||!n)return;const o=t.ui.view.toolbar.element;return n.appendChild(o),()=>{n.contains(o)&&n.removeChild(o)}},[t&&t.id]),m.createElement("div",{ref:V(r,e)})});xe.displayName="EditorToolbarWrapper";/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const De=()=>{const t=d.useRef(!1);return d.useEffect(()=>(t.current=!1,()=>{t.current=!0}),[]),t};/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const je=t=>{const[e,r]=d.useState({status:"idle"}),n=De(),o=d.useRef(null);return[we(async(...s)=>{if(n.current||z())return null;const i=P();o.current=i;try{e.status!=="loading"&&r({status:"loading"});const a=await t(...s);return!n.current&&o.current===i&&r({status:"success",data:a}),a}catch(a){console.error(a),!n.current&&o.current===i&&r({status:"error",error:a})}return null}),e]};/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */const Oe=(t,e)=>{const[r,n]=je(t);return Pe(r,e),n.status==="idle"?{status:"loading"}:n};/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */function Le(t){const e=JSON.stringify(t),r=Oe(async()=>he(t),[e]);return r.status==="success"?{...r.data,status:"success"}:r}export{Se as C,Le as u};
