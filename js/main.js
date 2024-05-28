(function () {
    'use strict'
    angular
    .module('acare', [])
    .controller('mainController', function($scope,$http) {
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
      vm.logout = function(){
        vm.current_user = null;
        vm.step = 1;
      }
      vm.login = function(){                
        if(vm.validaCampoLogin()){                    
          $http({
            method : 'POST',
            url    : 'http://localhost/acare/api/iniciar_sesion.php',
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
        console.log("Init ok");        
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
            url    : 'http://localhost/acare/api/crear_usuario.php',
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
        vm.aciertos_1 = 0;
        if(vm.current_user.q_1 == 'a'){
          vm.aciertos_1++;
        }
        if(vm.current_user.q_2 == 'a'){
          vm.aciertos_1++;
        }
        if(vm.current_user.q_3 == 'b'){
          vm.aciertos_1++;
        }
        if(vm.current_user.q_4 == 'b'){
          vm.aciertos_1++;
        }
        if(vm.current_user.q_5 == 'c'){
          vm.aciertos_1++;
        }
        vm.subLevel = 7;
      }

      vm.showLevel = function(l){
        vm.level = l;
        console.log(vm);
      }

    })
})();