;(function () {
   var KEY = 'swagger_bearer_token'
   var SERVER_KEY = 'swagger_selected_server'
   function init() {
      try {
         var system = window.ui && window.ui.getSystem && window.ui.getSystem()
         var authActions = system && system.authActions
         if (!authActions) return
         var origAuthorize = authActions.authorize
         authActions.authorize = function (payload) {
            try {
               if (payload && payload.bearerAuth && payload.bearerAuth.value) {
                  var token = payload.bearerAuth.value
                  localStorage.setItem(KEY, token)
               }
            } catch (e) {}
            return origAuthorize(payload)
         }
         // Auto-authorize from stored token
         var stored = localStorage.getItem(KEY)
         if (stored) {
            try {
               authActions.authorize({
                  bearerAuth: {
                     name: 'bearerAuth',
                     schema: { type: 'http', scheme: 'bearer' },
                     value: stored,
                  },
               })
            } catch (e) {}
         }

         // Persist server selection and reapply token when server changes.
         function findServerSelect() {
            var selects = document.querySelectorAll('select')
            for (var i = 0; i < selects.length; i++) {
               var s = selects[i]
               // heuristic: server select usually has option values starting with http
               if (s.options && s.options.length) {
                  for (var j = 0; j < s.options.length; j++) {
                     var v = s.options[j].value || ''
                     if (
                        v.indexOf('http://') === 0 ||
                        v.indexOf('https://') === 0
                     ) {
                        return s
                     }
                  }
               }
            }
            return null
         }

         function attachServerListener() {
            try {
               var sel = findServerSelect()
               if (!sel) return
               // avoid double-binding
               if (sel.__swagger_token_listener) return
               sel.__swagger_token_listener = true
               sel.addEventListener('change', function (ev) {
                  try {
                     var val = ev.target.value
                     if (val) localStorage.setItem(SERVER_KEY, val)
                     // reapply token after small delay so Swagger can re-init context
                     setTimeout(function () {
                        var t = localStorage.getItem(KEY)
                        if (t && authActions) {
                           try {
                              authActions.authorize({
                                 bearerAuth: {
                                    name: 'bearerAuth',
                                    schema: { type: 'http', scheme: 'bearer' },
                                    value: t,
                                 },
                              })
                           } catch (e) {}
                        }
                     }, 350)
                  } catch (e) {}
               })

               // if previously selected server exists, try to apply it
               var prev = localStorage.getItem(SERVER_KEY)
               if (prev) {
                  try {
                     for (var k = 0; k < sel.options.length; k++) {
                        if (sel.options[k].value === prev) {
                           sel.selectedIndex = k
                           // dispatch change so Swagger UI picks it up
                           var ev = new Event('change', { bubbles: true })
                           sel.dispatchEvent(ev)
                           break
                        }
                     }
                  } catch (e) {}
               }
            } catch (e) {}
         }

         // observe DOM mutations to reattach listener if Swagger re-renders
         var mo = new MutationObserver(function () {
            try {
               attachServerListener()
            } catch (e) {}
         })
         mo.observe(document.body, { childList: true, subtree: true })

         // also attach on clicks as fallback
         document.addEventListener('click', function () {
            try {
               attachServerListener()
            } catch (e) {}
         })
      } catch (e) {}
   }
   var t = setInterval(function () {
      if (
         window.ui &&
         window.ui.getSystem &&
         window.ui.getSystem().authActions
      ) {
         clearInterval(t)
         init()
      }
   }, 300)
})()
