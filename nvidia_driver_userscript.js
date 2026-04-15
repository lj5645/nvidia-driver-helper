// ==UserScript==
// @name         NVIDIA 驱动查询增强
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  修改 NVIDIA 驱动查询参数，获取更多驱动记录（支持 GeForce/RTX/Quadro/Tesla 等全产品线）
// @author       NVDriverHelper
// @match        https://www.nvidia.com/*
// @match        https://www.nvidia.cn/*
// @match        https://gfwsl.geforce.com/*
// @match        https://www.nvidia.com/download/*
// @match        https://www.nvidia.cn/download/*
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    var CONFIG = {
        numberOfResults: 10,
        driverType: 'all',
        forceStandard: false,
        version: '',
        release: ''
    };

    console.log('%c[NVDriverHelper] 用户脚本已加载 v2.8', 'color: #76b900; font-weight: bold; font-size: 14px;');

    try {
        var savedConfig = localStorage.getItem('nv-driver-helper-config');
        if (savedConfig) {
            Object.assign(CONFIG, JSON.parse(savedConfig));
            console.log('[NVDriverHelper] 加载保存的配置:', CONFIG);
        }
    } catch (e) {}

    function createInterceptorCode(config) {
        return '(function(){' +
            'var CONFIG=' + JSON.stringify(config) + ';' +
            'console.log("%c[NVDriverHelper] 拦截器已注入 v2.8","color:#76b900;font-weight:bold");' +
            'console.log("[NVDriverHelper] 当前配置:",CONFIG);' +
            'function modifyParams(url){' +
                'if(!url||typeof url!=="string")return url;' +
                'if(!url.includes("DriverManualLookup")&&!url.includes("DriverLookup")&&!url.includes("processFind.aspx")&&!url.includes("AjaxDriverService")&&!url.includes("lookupValueSearch")&&!url.includes("find.aspx")&&!url.includes("driverResults"))return url;' +
                'console.log("[NVDriverHelper] 拦截到请求:",url.substring(0,100));' +
                'var modified=url;' +
                'if(modified.includes("numberOfResults=")){' +
                    'modified=modified.replace(/numberOfResults=\\d+/,"numberOfResults="+CONFIG.numberOfResults);' +
                '}else{' +
                    'modified+="&numberOfResults="+CONFIG.numberOfResults;' +
                '}' +
                'if(CONFIG.driverType==="studio"){' +
                    'modified=modified.replace(/isWHQL=\\d/g,"isWHQL=0");' +
                    'modified=modified.replace(/isWHQL=null/g,"isWHQL=0");' +
                    'modified=modified.replace(/upCRD=\\d/g,"upCRD=1");' +
                    'modified=modified.replace(/upCRD=null/g,"upCRD=1");' +
                    'if(!modified.includes("isWHQL="))modified+="&isWHQL=0&upCRD=1";' +
                    'console.log("[NVDriverHelper] Studio驱动模式: isWHQL=0, upCRD=1");' +
                '}else if(CONFIG.driverType==="grd"){' +
                    'modified=modified.replace(/isWHQL=\\d/g,"isWHQL=1");' +
                    'modified=modified.replace(/isWHQL=null/g,"isWHQL=1");' +
                    'modified=modified.replace(/upCRD=\\d/g,"upCRD=0");' +
                    'modified=modified.replace(/upCRD=null/g,"upCRD=0");' +
                    'if(!modified.includes("isWHQL="))modified+="&isWHQL=1&upCRD=0";' +
                    'console.log("[NVDriverHelper] Game Ready驱动模式: isWHQL=1, upCRD=0");' +
                '}else{' +
                    'console.log("[NVDriverHelper] 全部驱动模式: 不修改驱动类型");' +
                '}' +
                'if(CONFIG.forceStandard){' +
                    'modified=modified.replace(/dch=1/g,"dch=0");' +
                    'console.log("[NVDriverHelper] 强制Standard驱动: dch=0");' +
                '}' +
                'if(CONFIG.version){' +
                    'if(modified.includes("version=")){' +
                        'modified=modified.replace(/version=[^&]*/,"version="+CONFIG.version);' +
                    '}else{' +
                        'modified+="&version="+CONFIG.version;' +
                    '}' +
                    'console.log("[NVDriverHelper] 指定版本:",CONFIG.version);' +
                '}' +
                'if(CONFIG.release){' +
                    'if(modified.includes("release=")){' +
                        'modified=modified.replace(/release=[^&]*/,"release="+CONFIG.release);' +
                    '}else{' +
                        'modified+="&release="+CONFIG.release;' +
                    '}' +
                    'console.log("[NVDriverHelper] 指定版本系列:",CONFIG.release);' +
                '}' +
                'console.log("%c[NVDriverHelper] 修改后URL:","color:green",modified.substring(0,200));' +
                'return modified;' +
            '}' +
            'var originalXHROpen=XMLHttpRequest.prototype.open;' +
            'XMLHttpRequest.prototype.open=function(method,url,async,user,password){' +
                'if(url&&typeof url==="string"){' +
                    'if(url.includes("DriverManualLookup")||url.includes("processFind.aspx")||url.includes("AjaxDriverService")||url.includes("lookupValueSearch")){' +
                        'url=modifyParams(url);' +
                    '}' +
                '}' +
                'return originalXHROpen.call(this,method,url,async!==false,user,password);' +
            '};' +
            'var originalFetch=window.fetch;' +
            'window.fetch=function(url,options){' +
                'if(url&&typeof url==="string"){' +
                    'if(url.includes("DriverManualLookup")||url.includes("processFind.aspx")||url.includes("AjaxDriverService")||url.includes("lookupValueSearch")){' +
                        'url=modifyParams(url);' +
                    '}' +
                '}else if(url&&url.url){' +
                    'var urlStr=url.url;' +
                    'if(urlStr.includes("DriverManualLookup")||urlStr.includes("processFind.aspx")||urlStr.includes("AjaxDriverService")||urlStr.includes("lookupValueSearch")){' +
                        'var modifiedUrl=modifyParams(urlStr);' +
                        'if(modifiedUrl!==urlStr){' +
                            'url=new Request(modifiedUrl,{method:url.method,headers:url.headers,body:url.body,mode:url.mode,credentials:url.credentials,cache:url.cache,redirect:url.redirect,referrer:url.referrer});' +
                        '}' +
                    '}' +
                '}' +
                'return originalFetch.call(this,url,options);' +
            '};' +
            'var originalOpen=window.open;' +
            'window.open=function(url,target,features){' +
                'if(url&&typeof url==="string"){' +
                    'if(url.includes("processFind.aspx")||url.includes("driverResults")){' +
                        'url=modifyParams(url);' +
                    '}' +
                '}' +
                'return originalOpen.call(this,url,target,features);' +
            '};' +
            'document.addEventListener("click",function(e){' +
                'var target=e.target;' +
                'while(target&&target.tagName!=="A")target=target.parentElement;' +
                'if(target&&target.href){' +
                    'if(target.href.includes("processFind.aspx")||target.href.includes("driverResults")){' +
                        'target.href=modifyParams(target.href);' +
                    '}' +
                '}' +
            '},true);' +
            'var originalSubmit=HTMLFormElement.prototype.submit;' +
            'HTMLFormElement.prototype.submit=function(){' +
                'if(this.action&&(this.action.includes("processFind.aspx")||this.action.includes("driverResults"))){' +
                    'this.action=modifyParams(this.action);' +
                '}' +
                'return originalSubmit.call(this);' +
            '};' +
            'console.log("%c[NVDriverHelper] 所有拦截器已启用!","color:#76b900;font-size:14px");' +
        '})();';
    }

    function injectInterceptor(config) {
        var script = document.createElement('script');
        script.id = 'nv-driver-helper-interceptor';
        script.textContent = createInterceptorCode(config);
        
        var oldScript = document.getElementById('nv-driver-helper-interceptor');
        if (oldScript) oldScript.remove();
        
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    }

    injectInterceptor(CONFIG);

    function modifyUrlParams(url) {
        if (!url || typeof url !== 'string') return url;
        
        var modified = url;
        
        if (modified.includes('numberOfResults=')) {
            modified = modified.replace(/numberOfResults=\d+/, 'numberOfResults=' + CONFIG.numberOfResults);
        } else {
            modified += '&numberOfResults=' + CONFIG.numberOfResults;
        }
        
        if (CONFIG.driverType === 'studio') {
            modified = modified.replace(/isWHQL=\d/, 'isWHQL=0');
            modified = modified.replace(/isWHQL=null/, 'isWHQL=0');
            modified = modified.replace(/upCRD=\d/, 'upCRD=1');
            modified = modified.replace(/upCRD=null/, 'upCRD=1');
            if (!modified.includes('isWHQL=')) {
                modified += '&isWHQL=0&upCRD=1';
            }
        } else if (CONFIG.driverType === 'grd') {
            modified = modified.replace(/isWHQL=\d/, 'isWHQL=1');
            modified = modified.replace(/isWHQL=null/, 'isWHQL=1');
            modified = modified.replace(/upCRD=\d/, 'upCRD=0');
            modified = modified.replace(/upCRD=null/, 'upCRD=0');
            if (!modified.includes('isWHQL=')) {
                modified += '&isWHQL=1&upCRD=0';
            }
        }
        
        if (CONFIG.forceStandard) {
            modified = modified.replace(/dch=1/g, 'dch=0');
        }
        
        if (CONFIG.version) {
            if (modified.includes('version=')) {
                modified = modified.replace(/version=[^&]*/, 'version=' + CONFIG.version);
            } else {
                modified += '&version=' + CONFIG.version;
            }
        }
        
        if (CONFIG.release) {
            if (modified.includes('release=')) {
                modified = modified.replace(/release=[^&]*/, 'release=' + CONFIG.release);
            } else {
                modified += '&release=' + CONFIG.release;
            }
        }
        
        return modified;
    }

    var originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        if (url && typeof url === 'string') {
            if (url.includes('DriverManualLookup') || 
                url.includes('DriverLookup') ||
                url.includes('processFind.aspx') ||
                url.includes('AjaxDriverService') ||
                url.includes('lookupValueSearch') ||
                url.includes('find.aspx')) {
                url = modifyUrlParams(url);
                console.log('[NVDriverHelper] XHR 修改:', url.substring(0, 100));
            }
        }
        return originalXHROpen.call(this, method, url, async !== false, user, password);
    };

    var originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url && typeof url === 'string') {
            if (url.includes('DriverManualLookup') || 
                url.includes('DriverLookup') ||
                url.includes('processFind.aspx') ||
                url.includes('AjaxDriverService') ||
                url.includes('lookupValueSearch') ||
                url.includes('find.aspx')) {
                url = modifyUrlParams(url);
                console.log('[NVDriverHelper] Fetch 修改:', url.substring(0, 100));
            }
        }
        return originalFetch.call(this, url, options);
    };

    function createPanel() {
        if (document.getElementById('nv-driver-helper-panel')) return;

        var panel = document.createElement('div');
        panel.id = 'nv-driver-helper-panel';
        
        var html = '<style>' +
            '#nv-driver-helper-panel{position:fixed;top:10px;right:10px;' +
            'background:linear-gradient(135deg,#76b900 0%,#5a9100 100%);' +
            'color:white;padding:15px;border-radius:8px;z-index:2147483647;' +
            'font-family:Arial,sans-serif;box-shadow:0 4px 15px rgba(0,0,0,0.3);' +
            'min-width:280px}' +
            '#nv-driver-helper-panel *{box-sizing:border-box}' +
            '#nv-driver-helper-panel h3{margin:0 0 10px;font-size:14px;display:flex;align-items:center;gap:8px}' +
            '#nv-driver-helper-panel .status{font-size:10px;background:rgba(255,255,255,0.2);padding:2px 6px;border-radius:10px}' +
            '#nv-driver-helper-panel label{display:block;margin:8px 0;font-size:12px}' +
            '#nv-driver-helper-panel input,#nv-driver-helper-panel select{width:100%;padding:6px 8px;margin-top:3px;' +
            'border:none;border-radius:4px;font-size:12px}' +
            '#nv-driver-helper-panel input[type=checkbox]{width:auto;margin-right:5px}' +
            '#nv-driver-helper-panel button{width:100%;padding:10px;margin-top:10px;' +
            'background:#fff;color:#76b900;border:none;border-radius:4px;' +
            'cursor:pointer;font-weight:bold;font-size:12px;transition:all 0.2s}' +
            '#nv-driver-helper-panel button:hover{background:#f0f0f0;transform:translateY(-1px)}' +
            '#nv-driver-helper-panel .minimize{position:absolute;top:8px;right:10px;cursor:pointer;font-size:18px;opacity:0.8}' +
            '#nv-driver-helper-panel .content{display:block}' +
            '#nv-driver-helper-panel.minimized .content{display:none}' +
            '#nv-driver-helper-panel.minimized{padding:10px 15px}' +
            '#nv-driver-helper-panel .info{background:rgba(0,0,0,0.2);padding:8px;border-radius:4px;' +
            'font-size:11px;margin-top:10px;line-height:1.4}' +
            '#nv-driver-helper-panel .success{background:rgba(0,100,0,0.3);padding:8px;border-radius:4px;' +
            'font-size:11px;margin-top:10px;text-align:center;display:none}' +
            '</style>' +
            '<span class="minimize" title="最小化">−</span>' +
            '<h3>NVIDIA 驱动查询增强 <span class="status">v2.7</span></h3>' +
            '<div class="content">' +
            '<label>显示驱动数量:<input type="number" id="hdv-numResults" value="' + CONFIG.numberOfResults + '" min="10" max="50"></label>' +
            '<label>驱动类型:<select id="hdv-driverType">' +
            '<option value="all"' + (CONFIG.driverType === 'all' ? ' selected' : '') + '>全部</option>' +
            '<option value="grd"' + (CONFIG.driverType === 'grd' ? ' selected' : '') + '>Game Ready</option>' +
            '<option value="studio"' + (CONFIG.driverType === 'studio' ? ' selected' : '') + '>Studio</option>' +
            '</select></label>' +
            '<label><input type="checkbox" id="hdv-forceStandard"' + (CONFIG.forceStandard ? ' checked' : '') + '>强制 Standard 驱动</label>' +
            '<label>版本号 (精确匹配):<input type="text" id="hdv-version" value="' + CONFIG.version + '" placeholder="如: 566.36"></label>' +
            '<label>版本系列 (模糊匹配):<input type="text" id="hdv-release" value="' + CONFIG.release + '" placeholder="如: 570"></label>' +
            '<div style="display:flex;gap:10px;margin-top:10px">' +
            '<button id="hdv-apply" style="flex:1">应用配置</button>' +
            '<button id="hdv-reset" style="flex:1;background:#333;color:#fff">重置</button>' +
            '</div>' +
            '<div class="success" id="hdv-success">配置已应用! 现在可以搜索驱动了。</div>' +
            '<div class="info">使用方法：<br>1. 配置参数并点击"应用配置"<br>2. 在 NVIDIA 页面搜索驱动<br>3. 查看更多驱动记录</div>' +
            '</div>';
        
        panel.innerHTML = html;
        document.body.appendChild(panel);

        panel.querySelector('.minimize').addEventListener('click', function() {
            panel.classList.toggle('minimized');
            panel.querySelector('.minimize').textContent = panel.classList.contains('minimized') ? '+' : '−';
        });

        var saveConfig = function() {
            CONFIG.numberOfResults = parseInt(document.getElementById('hdv-numResults').value) || 100;
            CONFIG.driverType = document.getElementById('hdv-driverType').value;
            CONFIG.forceStandard = document.getElementById('hdv-forceStandard').checked;
            CONFIG.version = document.getElementById('hdv-version').value.trim();
            CONFIG.release = document.getElementById('hdv-release').value.trim();
            localStorage.setItem('nv-driver-helper-config', JSON.stringify(CONFIG));
            console.log('[NVDriverHelper] 配置已保存:', CONFIG);
        };

        document.getElementById('hdv-apply').addEventListener('click', function() {
            saveConfig();
            injectInterceptor(CONFIG);
            document.getElementById('hdv-success').style.display = 'block';
            setTimeout(function() {
                document.getElementById('hdv-success').style.display = 'none';
            }, 3000);
        });

        document.getElementById('hdv-reset').addEventListener('click', function() {
            localStorage.removeItem('nv-driver-helper-config');
            CONFIG.numberOfResults = 10;
            CONFIG.driverType = 'all';
            CONFIG.forceStandard = false;
            CONFIG.version = '';
            CONFIG.release = '';
            document.getElementById('hdv-numResults').value = 10;
            document.getElementById('hdv-driverType').value = 'all';
            document.getElementById('hdv-forceStandard').checked = false;
            document.getElementById('hdv-version').value = '';
            document.getElementById('hdv-release').value = '';
            injectInterceptor(CONFIG);
            console.log('[NVDriverHelper] 配置已重置为默认值');
        });

        panel.querySelectorAll('input, select').forEach(function(el) {
            el.addEventListener('change', saveConfig);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createPanel);
    } else {
        createPanel();
    }

    console.log('%c[NVDriverHelper] 脚本初始化完成', 'color: #76b900;');

})();
