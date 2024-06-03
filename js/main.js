(function () {
    'use strict'
    angular
    .module('acare', [])
    .controller('mainController', function($scope,$http,$location) {
      var vm = this;
      vm.user = {usuario : '', pass: ''};
      vm.registroFields = {usuario : '', pass: '', pass_confirm : ''};
      vm.step = 0; /*{1:login,2:registro:3:hospital,4:registro_exitoso}*/
      vm.level = 0;
      vm.subLevel = 0;
      vm.current_user = null;
      vm.label_registro = "REGISTRARME"; 
      vm.showHelp = true;     
      vm.error = {
        msg : '',
        error : false
      }
      vm.dates = {
        2 : "9 DE JULIO",
        3 : "30 de julio", 
        4 : "20 agosto",
      }
      vm.logout = function(){
        vm.delete_cookie("acareuser");
        vm.current_user = null;
        vm.step = 1;
      }
      vm.login = function(){                
        if(vm.validaCampoLogin()){                    
          $http({
            method : 'POST',
            url    : 'https://acare.360grados-ondemand.com/api/iniciar_sesion.php',
            data : $.param({              
              nombre: vm.user.usuario,
              pass: vm.user.pass,
            }),
            headers: {
              'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            }, 
          }).then(function(res){              
            if(res?.data !== "false"){
              vm.user = {usuario : '', pass: ''};
              vm.error = {
                msg : '',
                error : false
              }
              vm.current_user = res.data;
              vm.step = 3;
              vm.setCookie("acareuser", vm.current_user, 365);
            } else{
              vm.error = {
                msg : 'Comprueba tus datos de acceso',
                error : true
              }
            }                     
          })
          .catch(function(err){
            vm.error.error = true;
            vm.error.msg = err.data !== undefined ? err.data.message : err.message;            
          });

        }else{
          vm.error = {
            msg : 'Porfavor, completa los datos solicitados',
            error : true
          }
        }
      }
      vm.$onInit = function(){
        let acareuser = vm.getCookie("acareuser");
        if (acareuser != null) {
          vm.current_user = acareuser;
          vm.step = 3;
        }           
      }

      vm.validaParams = function(){
        var urlParams = new URLSearchParams(window.location.search);
        var p_user = (urlParams.get('user') || false);
        if(p_user !== false){
          vm.registroFields.usuario = p_user;
          vm.step = 2;
        }else{
          vm.step = 1;
        }

      }

      vm.go = function(n){
        vm.error = {
          msg : '',
          error : false
        }
        vm.user = {usuario : '', pass: ''};
        vm.registroFields = {usuario : '', pass: '', pass_confirm : ''};
        vm.step = n;
      }

      /*Función para validar los campos de registro*/
      vm.validaCampo = function(){              
        return (vm.registroFields.usuario != '' && vm.registroFields.pass != '' && vm.registroFields.pass_confirm != '' && vm.registroFields.pass == vm.registroFields.pass_confirm);
      }

      /*Función para validar los campos al iniciar sesion*/
      vm.validaCampoLogin = function(){              
        return (vm.user.usuario != '' && vm.user.pass != '');
      }

      vm.registro = function(){        
        if(vm.validaCampo()){          
          $http({
            method : 'POST',
            url    : 'https://acare.360grados-ondemand.com/api/crear_usuario.php',
            data : $.param({              
              nombre: vm.registroFields.usuario,
              pass: vm.registroFields.pass,
            }),
            headers: {
              'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            }, 
          }).then(function(res){              
            if(res.data == "true"){
              vm.user = {usuario : '', pass: ''};
              vm.error = {
                msg : '',
                error : false
              }
              vm.step = 4;
            }else{
              vm.error = res.data;
            }
          })
          .catch(function(err){
            vm.error.error = true;
            vm.error.msg = err.data !== undefined ? err.data.message : err.message;            
          });

        }else{
          if(vm.registroFields.pass == vm.registroFields.pass_confirm){
            vm.error = {
              msg : 'Porfavor, completa los datos solicitados',
              error : true
            }
          }else{
            vm.error = {
              msg : 'Las contraseñas deben coincidir',
              error : true
            }
          }
        }
      }

      vm.quiz1 = function(){
        $http({
          method : 'POST',
          url    : 'https://acare.360grados-ondemand.com/api/save_quiz.php',
          data : $.param({user:JSON.stringify(vm.current_user)}),
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
          }, 
        }).then(function(res){              
          if(res?.data !== "false"){                        
            vm.aciertos_1 = 0;
            if(vm.current_user.q_1 == 'a'){
              vm.aciertos_1++;
            }
            if(vm.current_user.q_2 == 'b'){
              vm.aciertos_1++;
            }
            if(vm.current_user.q_3 == 'c'){
              vm.aciertos_1++;
            }
            if(vm.current_user.q_4 == 'b'){
              vm.aciertos_1++;
            }
            if(vm.current_user.q_5 == 'b'){
              vm.aciertos_1++;
            }
            vm.setCookie("acareuser", vm.current_user, 365);
            vm.subLevel = 7;  
          } else{
            vm.error = {
              msg : 'Error al guardar las respuestas del usuario',
              error : true
            }
          }                     
        })
        .catch(function(err){
          vm.error.error = true;
          vm.error.msg = err.data !== undefined ? err.data.message : err.message;            
        });        
      }

      vm.showLevel = function(l){
        vm.level = l;        
      }

      vm.saveView = function(v){
        $http({
          method : 'POST',
          url    : 'https://acare.360grados-ondemand.com/api/save_view.php',
          data : $.param({              
            id: vm.current_user.id,
            view : v            
          }),
          headers: {
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
          }, 
        }).then(function(res){              
          if(res?.data !== "false"){            
            vm.error = {
              msg : '',
              error : false
            }
            vm.current_user["v_"+v] = true;
            vm.setCookie("acareuser", vm.current_user, 365);
            vm.subLevel = 0;            
          } else{
            vm.error = {
              msg : 'Error al guardar la vista de usuario',
              error : true
            }
          }                     
        })
        .catch(function(err){
          vm.error.error = true;
          vm.error.msg = err.data !== undefined ? err.data.message : err.message;            
        });
      } 
      

      vm.setCookie = function(name, value, exdays) {
        var cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
        document.cookie = cookie;
      }

      vm.getCookie = function(name) {
        var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
        result && (result = JSON.parse(result[1]));        
        return result;
      }   

      vm.delete_cookie = function(name) {
        document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
      }

    })
})();