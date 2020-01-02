import { extend } from 'vee-validate'
import { required, integer } from 'vee-validate/dist/rules'

extend('integer', {
  ...integer,
  message: '{_field_}不是有效值'
})
//必填
extend('required', {
  ...required,
  message: '{_field_}不能为空'
})

//必选
extend('selected', {
  ...required,
  message: '请选择{_field_}'
})

//必上传
extend('updated', {
  ...required,
  message: '请上传{_field_}'
})

//手机号码
extend('mobile', {
  validate: value => {
    return /^1[0-9]{10}$/gi.test(value)
  },
  message: '{_field_}不是有效的手机号码'
})

//身份证号码
extend('idno', {
  validate: value => {
    return /^([0-9]{14}[0-9x])|([0-9]{17}[0-9x])$/gi.test(value)
  },
  message: '{_field_}不是有效的证件号码'
})

//金额验证
extend('amount', {
  validate: value => {
    return /^(([1-9][0-9]*)|(([0]\.\d{1,5}|[1-9][0-9]*\.\d{1,5})))$/gi.test(
      value
    )
  },
  message: '{_field_}不是有效的金额'
})
