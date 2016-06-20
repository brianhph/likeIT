var likeIT = function(id, data) {
	var buffer, e, host;
	this.id = id;
	this.Data = data;
	this.Ens = {};
	host = (typeof this.Data.wrapper == 'string') ? document.querySelector(this.Data.wrapper) : this.Data.wrapper;
	if (!this.determine() || !host) return;
	this.Ens.host = host;
	this.Ens.callBacks = [];
	this.Data.logined = (typeof this.Data.logined == 'boolean') ? this.Data.logined : false;
	this.Data.liked = (typeof this.Data.liked == 'boolean') ? this.Data.liked : false;
	this.Data.likes = (typeof this.Data.likes != 'undefined' && !isNaN(this.Data.likes)) ? parseInt(this.Data.likes, 10) : 0;
	if (!this.Data.logined && this.Data.liked) this.Data.liked = false;
	this.Data.xhr = '';
	if (this.Data.io) {
		//withCredentials
		this.Data.withCredentials = (typeof this.Data.withCredentials == 'boolean') ? this.Data.withCredentials : false;
	}//end if
	if (this.Data.sound) {
		//sound
		this.Ens.sound = mk('',{tag:'audio',att:{src:this.Data.sound}});
	}//end if

	//init
	buffer = mk();
	e = {};

	host.Data = { ClassID:this.id };
	if (!host.id) host.id = 'likeIT-' + this.id + getRand(1, 10000);
	buffer = this.template.cloneNode(true);
	if (this.wc.ShadowDOM) {
		e.root = host[this.wc.ShadowDOM]();
		e.root.innerHTML = '<style>' + this.cssStr + '</style>';
		this.Ens.sheet = e.root.querySelector('style');
		e.root.appendChild(buffer);
	} else {
		empty(host);
		host.appendChild(mk('', {tag:'h3', att:{innerHTML:'like-it'}}));
		host.appendChild(buffer);
		e.root = host;
	}//end if
	this.Ens.trigger = e.root.querySelector('a');
	this.Ens.trigger.Data = { ClassID:this.id };
	this.Ens.trigger.textContent = this.Data.likes;

	//evt
	this.Ens.trigger.addEventListener('click', this.eActG, false);

	// method bundle
	if (!this.wc.CustomElements) {
		Object.defineProperties(this.Ens.host, likeIT.prototype.properties);

		//attrChange
		if (this.observer) {
			e.config = {
				attributes: true
			};
			this.observer.observe(host, e.config);
		}//end if		
	}//end if

	//clear
	for (var i in e) e[i] = null;
	e = null;

	//remove hidden
	host.removeAttribute('hidden');

	//data init
	if (host.hasAttribute('disabled')) host.setAttribute('disabled', 'disabled');
	if (this.Data.io && this.Data.io.status) {
		e = this;
		setTimeout(
			function() {
				e.fetch('status');
			}
		, 100);
	} else {
		var m = this;
		setTimeout(
			function() {
				host.classList.add('ready');
				m.refresh();
			}
		, 50);
	}//end if

	//isReady
	this.Data.isReady = true;
};

likeIT.prototype = {
	path4Sound: 'sound/likeit.mp3',
	dependencies: [
		'createCSSClass'
	],
	determine: function() {
		if (typeof likeIT.prototype.isSupport == 'undefined') {
			var anis = isAniSupport(), css = [], e = {};
			likeIT.prototype.anis = anis;
			likeIT.prototype.wc = supportsWebComponents();
			likeIT.prototype.isSupport = true;
			likeIT.prototype.observer = '';
			likeIT.prototype.properties = {};
			likeIT.prototype.sound = '';

			//animation
			if (typeof anis != 'undefined') {
				e.transition = anis.transition + ':' + anis.transform +' 300ms cubic-bezier(.17,.67,.5,1.7),opacity 300ms cubic-bezier(.17,.67,.5,1.7);';
				e.aniBeforeNormal = e.transition + anis.transform+':scale(1);opacity:1;';
				e.aniBeforeAct = anis.transform+':scale(.001);opacity:0;';
				e.aniAfterNormal = e.transition + anis.transform+':scale(.001);opacity:0;';
				e.aniAfterAct = anis.transform+':scale(1);opacity:1;';
				e.aniWrap = anis.transition + ':opacity 300ms ease-in,color 300ms ease-in;';
			} else {
				e.aniBeforeNormal = 'visibility:visible;';
				e.aniBeforeAct = 'visibility:hide;';
				e.aniAfterNormal = 'visibility:hide;';
				e.aniAfterAct = 'visibility:visible;';
			}//end if

			//css
			e.scope = (this.wc.ShadowDOM) ? '' : 'like-it ';
			createCSSClass('like-it', 'position:relative;display:inline-block;font-size:3vmin;line-height:2.5;color:#fff;font-family:arial,helvetica,clean,sans-serif,Microsoft JhengHei,\\5FAE\\8EDF\\6B63\\9ED1\\9AD4;'+e.transition+e.aniBeforeAct);
			createCSSClass('like-it.ready', e.aniAfterAct);
			createCSSClass('like-it h3', 'display:none;');
			css.push({k:e.scope+'.likeit-wrap', v:'position:relative;color:inherit;display:block;text-decoration:none;padding-left:2.1em;'+e.aniWrap});//1.8+0.3
			css.push({k:e.scope+'.likeit-wrap:hover', v:'text-decoration:none;'});
			css.push({k:e.scope+'.likeit-wrap:before', v:'position:absolute;left:0;top:50%;content:"";width:1.8em;height:1.8em;margin-top:-1em;background-size:100%;background-repeat:no-repeat;display:block;background-image:url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCcgdmlld0JveD0nMCAwIDQwIDQwJz48cGF0aCBmaWxsPScjQjRCNEI1JyBkPSdNMjkuNTk3IDYuMDgzYzEuNjkgMCAzLjI4Ny43IDQuNDk0IDEuOTY4IDIuNTI2IDIuNjU3IDIuNTI2IDcuMTQzLjAwNSA5Ljc5M2wtMTQuMDUgMTQuNzI1TDYuMDA0IDE3Ljg1QzMuNDc3IDE1LjE5NCAzLjQ3NiAxMC43MDcgNiA4LjA1MmMxLjIwOC0xLjI3IDIuODA1LTEuOTcgNC40OTQtMS45NyAxLjY5IDAgMy4yODcuNyA0LjQ5NCAxLjk3bDIuMTYgMi4yNyAyLjg5OCAzLjA1IDIuODk4LTMuMDUgMi4xNi0yLjI3YzEuMjA3LTEuMjcgMi44MDItMS45NyA0LjQ5My0xLjk3bTAtNGMtMi43OTggMC01LjQyMiAxLjE0Mi03LjM5MiAzLjIxMmwtMi4xNiAyLjI3LTIuMTU4LTIuMjdjLTEuOTctMi4wNy00LjU5NS0zLjIxLTcuMzkzLTMuMjEtMi43OTYgMC01LjQyIDEuMTQtNy4zOSAzLjIxLTQuMDE2IDQuMjIyLTQuMDE2IDExLjA5IDAgMTUuMzEybDE2Ljk0IDE3Ljc1NiAxNi45NDQtMTcuNzZjNC4wMTUtNC4yMiA0LjAxNS0xMS4wODcgMC0xNS4zMS0xLjk2Ny0yLjA2Ny00LjU5My0zLjIxLTcuMzktMy4yMXonLz48L3N2Zz4=\');'+e.aniBeforeNormal});
			css.push({k:e.scope+'.likeit-wrap:after', v:'position:absolute;left:0;top:50%;content:"";width:1.8em;height:1.8em;margin-top:-1em;background-size:100%;background-repeat:no-repeat;display:block;background-image:url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MCcgaGVpZ2h0PSc0MCcgdmlld0JveD0nMCAwIDQwIDQwJz48cGF0aCBmaWxsPScjRjA1MDU1JyBkPSdNMjAuMDQ2IDM4LjM2M0wzLjEwNiAyMC42MDdDLS45MTMgMTYuMzg1LS45MTMgOS41MTcgMy4xMDIgNS4yOTRjMS45Ny0yLjA3IDQuNTk1LTMuMjEgNy4zOS0zLjIxIDIuOCAwIDUuNDIzIDEuMTQgNy4zOTQgMy4yMWwyLjE2IDIuMjcyIDIuMTU4LTIuMjdjMS45Ny0yLjA3IDQuNTk0LTMuMjEyIDcuMzkyLTMuMjEyczUuNDI0IDEuMTQgNy4zOTMgMy4yMWM0LjAxNSA0LjIyMyA0LjAxNSAxMS4wOSAwIDE1LjMxbC0xNi45NDQgMTcuNzZ6Jy8+PC9zdmc+\');'+e.aniAfterNormal});
			if (this.wc.ShadowDOM) {
				css.push({k:'h3', v:'display:none;'});
				css.push({k:':host(.act) .likeit-wrap:before', v:e.aniBeforeAct});
				css.push({k:':host(.act) .likeit-wrap:after', v:e.aniAfterAct});
				css.push({k:':host(.act) .likeit-wrap', v:'color:#f05055;'});
				css.push({k:':host([data-aspect="left"]) .likeit-wrap', v:'padding-left:0;padding-right:2.1em;'});
				css.push({k:':host([data-aspect="left"]) .likeit-wrap:before', v:'left:auto;right:0;'});
				css.push({k:':host([data-aspect="left"]) .likeit-wrap:after', v:'left:auto;right:0;'});
				css.push({k:':host([data-aspect="bottom"]) .likeit-wrap', v:'padding-left:0;padding-top:1.8em;'});
				css.push({k:':host([data-aspect="bottom"]) .likeit-wrap:before', v:'left:50%;top:.5em;margin-left:-1em;margin-top:auto;'});
				css.push({k:':host([data-aspect="bottom"]) .likeit-wrap:after', v:'left:50%;top:.5em;margin-left:-1em;margin-top:auto;'});
				css.push({k:':host([data-aspect="top"]) .likeit-wrap', v:'padding-left:0;padding-bottom:1.8em;'});
				css.push({k:':host([data-aspect="top"]) .likeit-wrap:before', v:'left:50%;top:auto;bottom:.5em;margin-left:-1em;margin-top:auto;'});
				css.push({k:':host([data-aspect="top"]) .likeit-wrap:after', v:'left:50%;top:auto;bottom:.5em;margin-left:-1em;margin-top:auto;'});
				css.push({k:':host([disabled]) .likeit-wrap', v:'pointer-events:none;opacity:.5;'});
			} else {
				e.scope = e.scope.trim();
				css.push({k:e.scope+'.act .likeit-wrap:before', v:e.aniBeforeAct});
				css.push({k:e.scope+'.act .likeit-wrap:after', v:e.aniAfterAct});
				css.push({k:e.scope+'.act .likeit-wrap', v:'color:#f05055;'});
				css.push({k:e.scope+'[data-aspect="left"] .likeit-wrap', v:'padding-left:0;padding-right:2.1em;'});
				css.push({k:e.scope+'[data-aspect="left"] .likeit-wrap:before', v:'left:auto;right:0;'});
				css.push({k:e.scope+'[data-aspect="left"] .likeit-wrap:after', v:'left:auto;right:0;'});
				css.push({k:e.scope+'[data-aspect="bottom"] .likeit-wrap', v:'padding-left:0;padding-top:1.8em;'});
				css.push({k:e.scope+'[data-aspect="bottom"] .likeit-wrap:before', v:'left:50%;top:.5em;margin-left:-1em;margin-top:auto;'});
				css.push({k:e.scope+'[data-aspect="bottom"] .likeit-wrap:after', v:'left:50%;top:.5em;margin-left:-1em;margin-top:auto;'});
				css.push({k:e.scope+'[data-aspect="top"] .likeit-wrap', v:'padding-left:0;padding-bottom:1.8em;'});
				css.push({k:e.scope+'[data-aspect="top"] .likeit-wrap:before', v:'left:50%;top:auto;bottom:.5em;margin-left:-1em;margin-top:auto;'});
				css.push({k:e.scope+'[data-aspect="top"] .likeit-wrap:after', v:'left:50%;top:auto;bottom:.5em;margin-left:-1em;margin-top:auto;'});
				css.push({k:e.scope+'[disabled] .likeit-wrap', v:'pointer-events:none;opacity:.5;'});
			}//end if

			//template
			e.buffer = mk();
			likeIT.prototype.template = e.buffer;
			e.likeitWrap = mk('likeit-wrap', {tag:'a', att:{href:'#likeIt'}});
			e.buffer.appendChild(e.likeitWrap);
			e.likeitWrap.setAttribute('title', 'like it');
			e.likeitWrap.textContent = '?';

			//evt
			if (!this.wc.CustomElements && typeof MutationObserver == 'function') {
				likeIT.prototype.observer = new MutationObserver(
					function(mutations) {
						mutations.forEach(function(mutation) {
							likeIT.prototype.mutate(mutation);
						});
					}
				);
			}//end if

			//properties
			likeIT.prototype.properties = {
				set: {
					configurable: false,
					value: likeIT.prototype.set
				},
				get: {
					configurable: false,
					value: likeIT.prototype.get
				},
				disabled: {
					configurable: false,
					get: function() {
						return this.hasAttribute('disabled');
					},
					set: function(flag) {
						(flag) ? this.setAttribute('disabled', 'disabled') : this.removeAttribute('disabled');
					}
				},
				aspect: {
					configurable: false,
					get: function() {
						var value;
						if (this.hasAttribute('data-aspect')) {
							value = this.getAttribute('data-aspect');
							if (['top', 'right', 'bottom', 'left'].indexOf(value) == -1) value = 'right';
						} else value = 'right';
						return value;
					},
					set: function(value) {
						var newVal;
						if (!value) return;

						value = value.toLowerCase();
						newVal = (['top', 'right', 'bottom', 'left'].indexOf(value) == -1) ? 'right' : value;
						this.setAttribute('data-aspect', newVal);
					}
				},
				addCallback: {
					configurable: false,
					value: likeIT.prototype.addCallback
				},
				removeCallback: {
					configurable: false,
					value: likeIT.prototype.removeCallback
				},
				click: {
					configurable: false,
					value: likeIT.prototype.clickAct
				}
			};

			//excute css
			if (this.wc.ShadowDOM) {
				e.cssStr = 'h3{display:block;margin:0;padding:0;}em{font-style:normal;}';
				while (css.length) {
					var c = css.shift();
					e.cssStr += c.k + '{' + c.v + '}';
				}//end while
				likeIT.prototype.cssStr = e.cssStr;
			} else {
				while (css.length) {
					var c = css.shift();
					createCSSClass(c.k, c.v);
				}//end while
			}//end if

			//clear
			css = null;
			for (var i in e) e[i] = null;
			e = null;

			//custom element
			this.activeCustomElement();
		}//end if
		return likeIT.prototype.isSupport;
	},
	activeCustomElement: function() {
		if (likeIT.prototype.activeCE) return;
		var b = ['', 'webkit', 'moz', 'o', 'ms'], api = 'registerElement', ce = '', prototype, observer;
		likeIT.prototype.activeCE = true;
		for (var i=-1,l=b.length;++i<l;) {
			var s = b[i], cApi = api;
			cApi = (s.length) ? api.replace(/^[a-z]{1}/,function($1){return $1.toLocaleUpperCase()}) : api;
			s += cApi;
			if (document[s]) { ce = s; break; }
		}//end for

		if (typeof OlikeIT == 'undefined') OlikeIT = {};
		if (!ce) {
			//attachedCallback
			if (typeof MutationObserver == 'function') {
				observer = new MutationObserver(
					function(mutations) {
						mutations.forEach(function(mutation) {
							if (mutation.type != 'childList') return;
							[].slice.call(mutation.addedNodes).forEach(
								function(node) {
									if (/like-it/i.test(node.tagName)) likeIT.prototype.attachedCallback(node);
								}
							);
						});
					}
				);
				observer.observe(document.body, {childList:true, subtree:true});
			}//end if

			//none custom element support
			[].slice.call(document.querySelectorAll('like-it')).forEach(
				function(node) {
					likeIT.prototype.attachedCallback(node);
				}
			);
		} else {
			prototype = Object.create(HTMLElement.prototype, likeIT.prototype.properties);
			prototype.attachedCallback = likeIT.prototype.attachedCallback;
			prototype.detachedCallback = function() {
				if (typeof this.id == 'undefined') return;
				OlikeIT['likeIT'+this.mid].terminate();
			};
			prototype.attributeChangedCallback = likeIT.prototype.attrChange;
			document[ce]('like-it', {prototype: prototype});
		}//end if
	},
	attachedCallback: function(node) {
		var conf, mid, tmp, target;
		if (typeof node != 'undefined') {
			//none custom element support
			if (!/like-it/i.test(node.tagName) || (typeof node.Data != 'undefined' && node.Data.isReady)) return;
			target = node;
		} else {
			target = this;
		}//end if
		if (typeof target.isReady != 'undefined') return;

		mid = 'M' + getRand(1, 10000) + '-' + getRand(1, 10000);
		target.mid = mid;
		target.isReady = true;
		conf = {
			wrapper: target,
			logined: false,
			liked: false,
			likes: 0
		};

		//likes
		tmp = target.querySelector('em');
		if (tmp && !isNaN(tmp.textContent)) {
			conf.likes = parseInt(tmp.textContent);
		}//end if

		if (target.hasAttribute('data-conf')) {
			try { tmp = JSON.parse(target.getAttribute('data-conf')); } catch (err) { tmp = {}; }
			for (var j in tmp) {
				conf[j] = tmp[j];
				tmp[j] = null;
			}//end ofr
			tmp = null;
			target.removeAttribute('data-conf');
		}//end if
		//likeIt
		OlikeIT['likeIT'+mid] = new likeIT(mid, conf);
	},
	attrChange: function(attrName, oldVal, newVal, target) {
		var ins, val;

		if (['data-aspect', 'disabled'].indexOf(attrName) == -1) return;
		ins = getIns(target || this, 'likeIT');
		if (!ins) return;
		switch (attrName) {
			case 'data-aspect':
				//doNothing
				break;
			case 'disabled':
				//doNothing
				break;
		}//end switch
	},
	mutate: function(mutation) {
		var attrName, oldVal, newVal;
		if (mutation.type != 'attributes') return;

		attrName = mutation.attributeName;
		oldVal = mutation.oldValue;
		newVal = mutation.target.getAttribute(attrName);
		likeIT.prototype.attrChange(attrName, oldVal, newVal, mutation.target);
	},
	i13n: function(action, label) {
		var data;
		if (typeof gaExt == 'undefined') return;

		data = {
			action: action
		};
		data.label = label || 'none';
		gaExt.doEventBeacon(this.Ens.host, data);
	},
	set: function(key, value) {
		var ins, flag = false;
		ins = getIns(this, 'likeIT');
		if (!ins) return;
		switch (key) {
			case 'logined':
				if (typeof value == 'boolean') {
					ins.Data.logined = value;
					flag = true;
				}//end if
				break;
			case 'liked':
				if (typeof value == 'boolean') {
					ins.Data.liked = value;
					ins.refresh();
					flag = true;
				}//end if
				break;
			case 'likes':
				if (typeof value == 'number') {
					ins.Data.likes = value;
					ins.refresh();
					flag = true;
				}//end if
				break;
			case 'sound':
				if (typeof value == 'string') {
					ins.Data.sound = value;
					ins.Ens.sound = mk('',{tag:'audio',att:{src:ins.Data.sound}});
					flag = true;
				}//end if
				break;
			case 'withCredentials':
				if (typeof value == 'boolean') {
					ins.Data.withCredentials = value;
					flag = true;
				}//end if
				break;
			case 'status':
				//io.status
				if (typeof value == 'object' && typeof value.length == 'undefined' && value.uri) {
					ins.Data.io.status = value;
					flag = true;
				}//end if
				break;
			case 'update':
				//io.update
				if (typeof value == 'object' && typeof value.length == 'undefined' && value.uri) {
					ins.Data.io.update = value;
					flag = true;
				}//end if
				break;
		}//ens switch
		return flag;
	},
	get: function(key) {
		var ins;
		ins = getIns(this, 'likeIT');
		if (!ins) return;
		//likes, logined, liked
		return ins.Data[key];
	},
	addCallback: function(fn) {
		var ins;
		ins = (typeof this.tagName != 'undefined') ? getIns(this, 'likeIT') : this;
		if (!ins || typeof fn != 'function' || ins.Ens.callBacks.indexOf(fn) != -1) return;
		ins.Ens.callBacks.push(fn);
	},
	removeCallback: function(fn) {
		var ins;
		ins = (typeof this.tagName != 'undefined') ? getIns(this, 'likeIT') : this;
		if (!ins || typeof fn != 'function' || ins.Ens.callBacks.indexOf(fn) == -1) return;
		ins.Ens.callBacks.splice(ins.Ens.callBacks.indexOf(fn), 1);
	},
	executeCallBack: function(action, label) {
		//addTag, removeTag, error
		this.Ens.callBacks.forEach(
			function(fn) {
				fn(action, label);
			}
		);
	},
	clickAct: function() {
		var ins;
		ins = getIns(this, 'likeIT');
		if (!ins) return;
		ins.Ens.trigger.click();
	},
	eActG: function(e) {
		var obj, ins;
		obj = tNa(e, 'a');
		ins = getIns(obj.t, 'likeIT');
		if (ins) ins.eAct(e);
	},
	eAct: function(e) {
		stopEvents(e);
		this.fetch('update');
	},
	fetch: function(type) {
		var xhr, fd, sets, t, io, act;

		t = (!type || ['status', 'update'].indexOf(type) == -1) ? 'status' : type;
		if (!this.Data.io || !this.Data.io[t]) {
			this.executeCallBack('error', 'none web service available');
			return;
		}//end if
		if (t == 'status') this.Ens.host.setAttribute('disabled', 'disabled');
		else if (!this.Data.logined) {
			this.executeCallBack('error', 'not login');
			return;
		}//end if
		io = this.Data.io[t];
		act = 'status';

		if (this.Data.xhr) this.Data.xhr.abort();
		xhr = new XMLHttpRequest() || new XDomainRequest();
		this.Data.xhr = xhr;

		fd = new FormData();

		//formData
		if (io.params) {
			for (var i in io.params) fd.append(i, io.params[i]);
		}//end if
		if (t == 'update') {
			if (this.Data.liked) {
				act = 'unlike';
				this.Data.likes--;
				if (this.Data.likes < 0) this.Data.likes = 0;
			} else {
				act = 'like';
				this.Data.likes++;
			}//end if

			fd.append('act', act);
			fd.append('likes', this.Data.likes);
			this.Data.liked = !this.Data.liked;
			this.refresh();
		}//end if
		this.i13n('likeAct', act);

		sets = ['abort', 'error', 'readystatechange'];
		for (var i=-1,l=sets.length;++i<l;) xhr.addEventListener(sets[i], this.xhrHandle, false);

		xhr.withCredentials = this.Data.withCredentials;
		xhr.mid = this.id;
		xhr.args = {
			type: t,
			act: act
		};
		xhr.open('POST', io.uri, true);
		xhr.send(fd);
	},
	xhrHandle: function(e) {
		var obj = tNa(e);
		switch (obj.a) {
			case 'readystatechange':
				if (this.readyState == 4) {
					OlikeIT['likeIT'+this.mid].qd(this);
				}//end if
				break;
		}//end switch
	},
	qd: function(o) {
		var ResultObj, info;
		ResultObj = {info:'fail'};
		if (o.status == 200) {
			try {ResultObj=JSON.parse(o.responseText.replace(/\)\]\}',\n/, ''));} catch(e) {}
		}//end if
		this.Ens.host.removeAttribute('disabled');
		if (ResultObj.info == 'success') {
			info = {};
			if (o.args.type == 'status') {
				this.Data.logined = ResultObj.data.logined;
				info.logined = this.Data.logined;
				this.Ens.host.classList.add('ready');
			}//end if
			this.Data.liked = ResultObj.data.liked;
			if (ResultObj.data.likes && !isNaN(ResultObj.data.likes)) this.Data.likes = parseInt(ResultObj.data.likes, 10);
			this.refresh();

			info.liked = this.Data.liked;
			info.likes = this.Data.likes;
			this.executeCallBack(o.args.act, info);
		} else {
			//error occur
			this.rollBack(JSON.parse(JSON.stringify(o.args)));
		}//end if
	},
	soundPlay: function() {
		if (!this.Ens.sound) return;
		//sound
		this.Ens.sound.currentTime = 0;
		this.Ens.sound.play();
	},
	rollBack: function(info) {
		var msg;
		if (!info.type || ['status', 'update'].indexOf(info.type) == -1) return;
		if (info.type == 'status') {
			//status
			msg = 'status init fail';
		} else {
			//update
			if (info.act == 'like') {
				this.Data.liked = false;
				this.Data.likes--;
				if (this.Data.likes < 0) this.Data.likes = 0;
				msg = 'like action fail';
			} else {
				this.Data.liked = true;
				this.Data.likes++;
				msg = 'unlike action fail';
			}//end if
			this.refresh();
		}//end if
		this.executeCallBack('error', msg);
	},
	format: function() {
		var likes = this.Data.likes, fixed, pattern;

		fixed = /(\d+\.\d{1})\d+$/;
		pattern = /\.0+$/;

		if (likes >= 1000000) {
			likes = (likes / 1000000).toString().replace(fixed, '$1').replace(pattern, '') + 'M';
		} else if (likes >= 1000) {
			likes = (likes / 1000).toString().replace(fixed, '$1').replace(pattern, '') + 'K';
		}//end if
		return likes;
	},
	refresh: function() {
		this.Ens.trigger.textContent = this.format();
		this.Ens.host.classList[this.Data.liked ? 'add' : 'remove']('act');
		if (this.Data.liked) {
			this.Ens.host.classList.add('act');
			if (this.Ens.sound) {
				try {
					this.Ens.sound.currentTime = 0;
					this.Ens.sound.play();
				} catch (err) {}
			}//end if
		} else this.Ens.host.classList.remove('act');
	},
	terminate: function() {
		var mid = this.id, sets;

		//events
		this.Ens.trigger.addEventListener('click', this.eActG, false);

		setTimeout(function(){
			var c = OlikeIT['likeIT'+mid];
			purge(c.Data);
			for (var i in c.Ens) c.Ens[i] = null;
			c.id = c.Data = c.Ens = null;
			try { delete(OlikeIT['likeIT'+mid]); } catch(e) {}
		}, 100);
	}
};

/*auto-registration*/
(function() {
	var dependencies, c = 0, max = 10000;//10 seconds
	if (typeof navigator.oRegists == 'undefined') navigator.oRegists = {};
	dependencies = likeIT.prototype.dependencies;
	navigator.oRegists.likeIt = setInterval(
		function() {
			var isReady = true;
			c += 5;
			if (c >= max) {
				clearInterval(navigator.oRegists.likeIt);
				return;
			}//end if
			for (var i=-1,l=dependencies.length;++i<l;) {
				var root = window, d = dependencies[i].split('.');
				while (d.length) {
					var prop = d.shift();
					if (!root[prop]) {
						root = null;
						break;
					} else root = root[prop];
				}//end while
				isReady &= (root != null);
			}//end for
			if (isReady && document.body) {
				clearInterval(navigator.oRegists.likeIt);
				navigator.oRegists.likeIt = null;
				likeIT.prototype.determine();
			}//end if
		}
	, 5);
})();
/*programed by mei(李維翰), http://www.facebook.com/mei.studio.li*/