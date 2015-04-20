
var RegistrationFormModel=function(){function getEmailText(){return $('#email-text').val();}
function setEmailText(value){$('#email-text').val(value);}
function getPasswordText(){return $('#password-text').val();}
function getProfessionText(){return $('#profession-text').val();}
function setPasswordText(value){$('#password-text').val(value);}
function getBMANumberText(){return $('#bma-text').val();}
function setBMANumberText(value){$('#bma-text').val(value);}
function getAccessCodeText(){return $('#access-text').val();}
function setAccessCodeText(value){$('#access-text').val(value);}
return{getEmailText:getEmailText,setEmailText:setEmailText,getPasswordText:getPasswordText,setPasswordText:setPasswordText,getProfessionText:getProfessionText,getBMANumberText:getBMANumberText,setBMANumberText:setBMANumberText,getAccessCodeText:getAccessCodeText,setAccessCodeText:setAccessCodeText};};RegistrationFormController={icsCountryList:function(){$.getJSON(retrieveIcsCountryListURL,null,RegistrationFormView.renderCountryList);},checkExistingEmail:function(email){var isExisting=false;$.post(checkExistingEmailURL,{'username':email},function(data){if(data.status=='200')
{if(data.output.isUsernameExists)
{isExisting=true;RegistrationFormView.renderExistingEmailAlert(data.message);}
else
{RegistrationFormView.renderHideExistingEmailAlert();}}
else
{RegistrationFormView.renderHideExistingEmailAlert();}});return isExisting;},enableButton:function(id){$(id).removeAttr('disabled');},validateForm:function(model){var isValid=true;var email=model.getEmailText();var password=model.getPasswordText();var bmaNumber=model.getBMANumberText();var accessCode=model.getAccessCodeText();if(!isValidEmail(email))
{isValid=false;RegistrationFormView.showWarningDialog('email');}
else
{var isExisting=this.checkExistingEmail(email);if(isExisting)
{isValid=false;}}
if(!isValidPassword(password))
{isValid=false;RegistrationFormView.showWarningDialog('password');}
if(bmaNumber!='')
{if(!isValidBmaNumberLength(bmaNumber))
{isValid=false;RegistrationFormView.showWarningDialog('bma');}}
if(accessCode!='')
{if(!isValidAccessCodeLength(accessCode))
{isValid=false;RegistrationFormView.showWarningDialog('accessCode');}}
return isValid;},validateEmail:function(txt){if(!isValidEmail(txt))
{RegistrationFormView.showWarningDialog('email');}
else
{this.checkExistingEmail(txt);}},validatePassword:function(txt,buttonId)
{if(!isValidPassword(txt))
{RegistrationFormView.showWarningDialog('password');}
else
{RegistrationFormView.hideData('#create-account-form #password-errors');this.enableButton(buttonId);}},validateAccessCode:function(txt,buttonId)
{if(!isValidAccessCodeLength(txt))
{RegistrationFormView.showWarningDialog('accessCode');}
else
{RegistrationFormView.hideData('#create-account-form #accessCode-errors');this.enableButton(buttonId);}},validateBmaNumber:function(txt,buttonId)
{if(!isValidBmaNumberLength(txt))
{RegistrationFormView.showWarningDialog('bma');}
else
{RegistrationFormView.hideData('#create-account-form #bma-errors');this.enableButton(buttonId);}},submitForm:function(model){RegistrationFormView.disableButton('#create-account-button');if(this.validateForm(model))
{$.ajax({type:'POST',url:createNewUserURL,data:$("#create-account-form").serialize(),success:function(data){if(data.status=='200')
{__gaTracker('send','event','shortReg-Success','submit','Account created successfully');if(data.output.registrationResult==''||data.output.registrationResult==undefined)
{window.location.href="/learning/home.html?isSuccess=true";}
else
{if(data.output.registrationResult.bmaValidationResult!=undefined&&data.output.registrationResult.bmaValidationResult!='OKAY')
{window.location.href="/learning/home.html?isBMAInvalid=true";}
else if(data.output.registrationResult.accessCodeResult!=undefined&&data.output.registrationResult.accessCodeResult.indexOf('ERROR')>-1)
{window.location.href="/learning/home.html?isAccessCodeInvalid=true";}
else
{window.location.href="/learning/home.html?isSuccess=true";}}}
else
{RegistrationFormView.renderErrorMessage(data.message);return false;}},error:function(jqXHR,textStatus,errorThrown){RegistrationFormView.renderErrorMessage(errorThrown);return false;}});}
else
{RegistrationFormView.renderCreateButtonValue(jQuery.i18n.prop('footer.my.account.create'));__gaTracker('send','event','shortReg-SubmitInvalidForm','click','short registration click create account failed validation');return false;}
return false;}};$(document).ready(function(){var createAccountButtonId='#create-account-button';$('input:radio[name="choice"]').prop('checked',false);$('#email-text').on('blur',function(){var email=$('#email-text').val();RegistrationFormController.validateEmail(email);});$("#email-text").on('keyup',function(){var email=$('#email-text').val();if(isValidEmail(email))
{if($('#create-account-button').hasAttr('disabled'))
{RegistrationFormView.renderCreateButtonValue(jQuery.i18n.prop('footer.my.account.create'));RegistrationFormController.enableButton(createAccountButtonId);}}});$('#password-text').on('blur',function(){var password=$('#password-text').val();RegistrationFormController.validatePassword(password,createAccountButtonId);});$("#password-text").on('keyup',function(){var password=$('#password-text').val();RegistrationFormController.validatePassword(password,createAccountButtonId);});$('#create-account-button').on('click',function(){RegistrationFormView.hideData('#create-account-errors');RegistrationFormView.disableButton('#create-account-button');RegistrationFormView.renderCreateButtonValue(jQuery.i18n.prop('learning.module.processing.submit'));var model=new RegistrationFormModel();__gaTracker('send','event','registerButton','click','register-button');__gaTracker('send','event','shortReg-CreateAccount','click','short registration page, click create account button');RegistrationFormController.submitForm(model);return false;});$('input:radio[name="choice"]').change(function(){if($(this).is(':checked')&&$(this).val()=='bma-option'){$("#bma-number").show();$("#access-code").hide();}
else if($(this).is(':checked')&&$(this).val()=='accessCode-option'){$("#access-code").show();$("#bma-number").hide();}
else{$("#bma-number").hide();$("#access-code").hide();}});$('#bma-text').on('blur',function(){var bma=$('#bma-text').val();RegistrationFormController.validateBmaNumber(bma,createAccountButtonId);});$('#bma-text').on('keyup',function(){var bma=$('#bma-text').val();RegistrationFormController.validateBmaNumber(bma,createAccountButtonId);});$('#access-text').on('blur',function(){var accessCode=$('#access-text').val();RegistrationFormController.validateAccessCode(accessCode,createAccountButtonId);});$('#access-text').on('keyup',function(){var accessCode=$('#access-text').val();RegistrationFormController.validateAccessCode(accessCode,createAccountButtonId);});$('#login-button').on('click',function(){var logInEmail=$("#sign-in-form #email-text").val();var logInPassword=$("#sign-in-form #password-text").val();if(($("#sign-in-form #email-text").val()=='')&&($("#sign-in-form #password-text").val()=='')){$('#sign-in-form #email-errors').text('Please enter your email');$('#sign-in-form #email-errors').show();$('#sign-in-form #password-errors').text('Please enter your password');$('#sign-in-form #password-errors').show();$('#sign-in-form #email-errors').show();return false;}
else if($("#sign-in-form #email-text").val()==''){$('#sign-in-form #email-errors').text('Please enter your email');$('#sign-in-form #email-errors').show();$('#sign-in-form #password-errors').hide();return false;}
else if($("#sign-in-form #password-text").val()==''){$('#sign-in-form #password-errors').text('Please enter your password');$('#sign-in-form #password-errors').show();$('#sign-in-form #email-errors').hide();return false;}
else{$('#sign-in-form #email-errors').hide();$('#sign-in-form #password-errors').hide();__gaTracker('send','event','shortReg-Login','click','short registration page, existing user login');}});});RegistrationFormController.submitForm=function(model){RegistrationFormView.disableButton('#create-account-button');var isValidForm=this.validateForm(model);var isValidProf=true;var profession=model.getProfessionText();if(!isValidProfession(profession))
{isValidProf=false;RegistrationFormView.showWarningDialog('profession');}
if(isValidForm&&isValidProf)
{$.post(createNewUserWithProfessionURL,$("#create-account-form").serialize(),function(data){if(data.status=='200')
{__gaTracker('send','event','shortRegWithProfession-Success','submit','Account created successfully');if(data.output.registrationResult==''||data.output.registrationResult==undefined){window.location.href="/learning/home.html?isSuccess=true";}
else{if(data.output.registrationResult.bmaValidationResult!=undefined&&data.output.registrationResult.bmaValidationResult!='OKAY')
{window.location.href="/learning/home.html?isBMAInvalid=true";}
else if(data.output.registrationResult.accessCodeResult!=undefined&&data.output.registrationResult.accessCodeResult.indexOf('ERROR')>-1)
{window.location.href="/learning/home.html?isAccessCodeInvalid=true";}
else
{window.location.href="/learning/home.html?isSuccess=true";}}}
else
{RegistrationFormView.renderErrorMessage(data.message);return false;}}).error(function(jqXHR,textStatus,errorThrown){RegistrationFormView.renderErrorMessage(errorThrown);return false;});}
else
{RegistrationFormView.renderCreateButtonValue(jQuery.i18n.prop('footer.my.account.create'));__gaTracker('send','event','shortRegWithProfession-SubmitInvalidForm','click','short registration click create account failed validation');return false;}
return false;};RegistrationFormController.validateProfession=function(txt,buttonId){if(!isValidProfession(txt))
{RegistrationFormView.showWarningDialog('profession');}
else
{RegistrationFormView.hideData('#create-account-form #profession-errors');this.enableButton(buttonId);}};RegistrationFormController.professionList=function(){$.getJSON(retrieveProfessionListURL,null,RegistrationFormView.renderProfessionList);RegistrationFormController.initProfession();};RegistrationFormController.initProfession=function(){var createAccountButtonId='#create-account-button';$(document).on('change','#profession-text',function(){var profession=$("#profession-text").val();RegistrationFormController.validateProfession(profession,createAccountButtonId);});};RegistrationFormView={renderCountryList:function(data){var html='<select data-original-title="Please let us know the country you are working or studying in." id="country-list" name="countryCode" class="jscluetip" title="">';var defaultCountryCode='GB';var defaultCountry='United Kingdom';var ipCountryCode=defaultCountryCode;var ipCountry=defaultCountry;if(data.status=='200')
{$.each(data.output.countries,function(i,item){var isMatched='';if(item.value==ipCountryCode||item.text==ipCountry)
{isMatched='selected';}
html+='<option value="'+item.value+'"'+isMatched+'>'+item.text+'</option>';});}
html+='</select>';return $('#country-list').html(html);},renderProfessionList:function(data){var html='<select data-original-title="Please let us know your profession." id="profession-text" name="professionCode" class="jscluetip" title="">';html+='<option value="">'+jQuery.i18n.prop('info.please.select')+'</option>';if(data.status=='200')
{$.each(data.output.professions,function(i,item){html+='<option value="'+item.masterIcsValue+'">'+item.text+'</option>';});}
html+='</select>';return $('#profession-list').html(html);},showWarningDialog:function(data)
{if(data=='email')
{$('#create-account-form #create-email-errors').text(jQuery.i18n.prop('alert.enter.email'));$('#create-account-form #create-email-errors').show();$('#create-account-button').attr('disabled','disabled');}
else if(data=='password')
{$('#create-account-form #password-errors').text(jQuery.i18n.prop('alert.enter.password.length'));$('#create-account-form #password-errors').show();$('#create-account-button').attr('disabled','disabled');}
else if(data=='bma')
{$('#create-account-form #bma-errors').text(jQuery.i18n.prop('register.error.invalid.bma.number'));$('#create-account-form #bma-errors').show();$('#create-account-button').attr('disabled','disabled');}
else if(data=='accessCode')
{$('#create-account-form #accessCode-errors').text(jQuery.i18n.prop('register.error.invalid.accessCode.number'));$('#create-account-form #accessCode-errors').show();$('#create-account-button').attr('disabled','disabled');}
else if(data=='profession')
{$('#create-account-form #profession-errors').text(jQuery.i18n.prop('info.choose.profession'));$('#create-account-form #profession-errors').show();$('#create-account-button').attr('disabled','disabled');}
return false;},renderExistingEmailAlert:function(msg)
{$('#create-email-errors').html(msg);$('#create-email-errors').show();$('#create-account-button').attr('disabled','disabled');},renderHideExistingEmailAlert:function()
{$('#create-email-errors').hide();$('#create-account-button').removeAttr('disabled');},renderErrorMessage:function(msg)
{this.renderCreateButtonValue(jQuery.i18n.prop('footer.my.account.create'));$('#create-account-errors').text(msg);$('#create-account-errors').show();},renderCreateButtonValue:function(value)
{$('#create-account-button').text(value);},disableButton:function(divId)
{$(divId).attr('disabled','disabled');},hideData:function(divId)
{$(divId).hide();}};