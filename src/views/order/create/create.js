import Menus from '@/components/Menus'
import VersionSelector from '@/components/VersionSelector'
import {
  templates,
  deviceTemplate,
  create,
  detail,
  edit,
  draftDetail,
  draftSave,
} from '@/services/order'
import {
  icbSaleList,
  saleList,
  configList,
  shopDetail,
  financeRemark,
} from '@/services/account'
import { ocr, upload } from '@/services/ocr'
import { toDate } from '@/utils'
// 表单验证
import '@/utils/rules'
import { ValidationObserver, ValidationProvider } from 'vee-validate'

import { mapGetters } from 'vuex'
import Vue from 'vue'
import {
  NavBar,
  CellGroup,
  SwitchCell,
  Row,
  Col,
  Picker,
  Field,
  NumberKeyboard,
  DatetimePicker,
  Uploader,
  RadioGroup,
  Radio,
  Button,
  Popup,
  Icon,
  Dialog,
} from 'vant'
Vue.use(NavBar)
  .use(CellGroup)
  .use(SwitchCell)
  .use(Row)
  .use(Col)
  .use(Picker)
  .use(Field)
  .use(NumberKeyboard)
  .use(DatetimePicker)
  .use(Uploader)
  .use(RadioGroup)
  .use(Radio)
  .use(Button)
  .use(Popup)
  .use(Icon)
  .use(Dialog)

export const createOrder = {
  name: 'CreateOrder',
  components: {
    Menus,
    VersionSelector,
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      title: '',
      orderId: '',
      keyword: '',
      model: {
        ownerType: 1,
        cardType: 1,
        payRemark: '',
        vehicleExtend: {
          financeRemark: '',
          plateColor: '蓝色',
          buyTime: new Date(),
        },
        installExtend: {
          addressType: 1,
          address: '',
          contractType: 0,
          contractName: '',
          contractMobile: '',
        },
        remark: '',
        orderSource: 4,
        isElectronPolicy: true,
        isCreateInstall: true,
        isCreateOwner: true,
        joinHuzhu: true,
        jieyixian: false,
        serviceStart: new Date().addDays(1),
        extendPicture: [],
        draftId: '',
      },
      popList: {
        shops: false,
        icbSales: false,
        saleList: false,
        idType: false,
        contactType: false,
        paymode: false,
        installContact: false,
        insurances: false,
        templates: false,
        buyTime: false,
        serviceStart: false,
        versionSelector: false,
        configList: false,
        finances: false,
        vins: false,
        engines: false,
        factories: false,
        deviceTemplates: false,
      },
      currentPop: '',
      ocrs: {
        vins: [], //车架号
        engines: [], //发动机号
        factories: [], //厂牌型号
      },
      scrollTop: 0,
      showForm: true,
      isCompany: false,
      currentShop: {},
      currentIcbSale: { text: '' },
      currentSale: { text: '' },
      currentTemplate: { text: '' },
      cardType: '身份证',
      paymode: '',
      vehicleVersion: '',
      brandName: '',
      deviceTemplate: '',
      installContact: '驻店员',
      idTypes: [
        { type: 1, text: '身份证' },
        { type: 2, text: '驾驶证' },
        { type: 3, text: '军官证' },
        { type: 4, text: '护照' },
        { type: 6, text: '港澳通行证' },
      ],
      contactTypes: ['家人', '同事', '朋友', '其他'],
      paymodes: [
        { type: 1, text: '支付宝' },
        { type: 2, text: '微信' },
        { type: 3, text: '对公转账' },
        { type: 4, text: '成都银行扫码' },
        { type: 5, text: 'POS机' },
        { type: 6, text: '月结' },
      ],
      installContacts: [
        { type: 0, text: '驻店员' },
        { type: 1, text: '销售顾问' },
        { type: 2, text: '车主' },
        { type: 3, text: '备用联系人' },
        { type: -1, text: '其他' },
      ],
      sourceList: {
        saleList: [],
        finances: [],
        configList: [],
        shops: [],
      },
      icbSaleList: [],
      saleList: [],
      templates: [],
      configList: [],
      deviceTemplates: [],
      previewIdCard: [],
      previewBusiLicense: [],
      previewInvoice: [],
      previewQc: [],
      previewPayment: [],
      previewExtend: [],
      invoiceAmountShow: false,
      mortgageAmountShow: false,
      mortgageMonthShow: false,
      insuredAmountShow: false,
      receivableAmountShow: false,
      paidAmountShow: false,
      handlePaidAmountShow: false,
      handleJieyixianAmountShow: false,
      jieyiState: false,
    }
  },
  computed: {
    ...mapGetters(['shops', 'insurances', 'finances', 'carTypes', 'motoTypes']),
  },
  mounted() {
    if (this.$route.params.id) {
      this.title = '编辑订单'
      this.orderId = this.$route.params.id
      detail(this.orderId).then((json) => {
        this.parseOrderDetail(json)
        this.loadModels()
      })
    } else if (this.$route.params.draftId) {
      this.title = '编辑草稿'
      let draftId = this.$route.params.draftId
      draftDetail(draftId).then((json) => {
        this.parseOrderDetail(json)
        this.model.draftId = draftId
        this.loadModels()
      })
    } else {
      this.title = '创建订单'
      this.loadModels()
      this.model.serviceStart = new Date().addDays(1)
    }
  },
  methods: {
    loadModels() {
      this.$store.dispatch('getShops', () => {
        if (this.shops.length > 0) {
          var shop
          if (this.model.shopId) {
            shop = this.shops.find((e) => e.id === this.model.shopId) || {
              id: this.model.shopId,
              text: this.model.shopName,
            }
          } else {
            shop = this.shops[0]
          }
          this.changeShop(shop)
          //金融公司
          this.$store.dispatch('getFinances', () => {
            if (this.model.vehicleExtend.financeId) {
              var item = this.finances.find(
                (e) => e.id === this.model.vehicleExtend.financeId
              ) || {
                id: this.model.vehicleExtend.financeId,
                text: this.model.vehicleExtend.financeName,
              }
              this.changeFinanceUnit(item)
            }
          })
        }
      })
      //保险公司
      this.$store.dispatch('getInsurances', () => {
        if (this.insurances.length > 0) {
          if (this.model.electronPolicySupplierId) {
            var item = this.insurances.find(
              (e) => e.id === this.model.electronPolicySupplierId
            ) || {
              id: this.model.electronPolicySupplierId,
              text: this.model.electronPolicySupplierName,
            }
            this.changeInsurance(item)
          } else {
            this.changeInsurance(this.insurances[0])
          }
        }
      })

      if (this.model.payType) {
        var item = this.paymodes.find((e) => e.type === this.model.payType) || {
          type: this.model.payType,
        }
        this.changePaymode(item, 0, this.model.payRemark)
      }
    },
    parseOrderDetail(json) {
      this.model = Object.assign({}, json)
      if (this.model.ownerType == 1) {
        this.isCompany = false
        this.previewIdCard = [{ url: this.model.cardPicture }]
      } else {
        this.isCompany = true
        this.previewBusiLicense = [{ url: this.model.cardPicture }]
      }
      this.previewInvoice = [{ url: this.model.vehicleExtend.invoice }]
      this.previewQc = [{ url: this.model.vehicleExtend.certificate }]
      if (this.model.payPictures) {
        this.previewPayment = [{ url: this.model.payPictures }]
      }
      if (this.model.extendPicture && this.model.extendPicture.length) {
        for (var i in this.model.extendPicture) {
          this.previewExtend.push({ url: this.model.extendPicture[i] })
        }
      }
      this.deviceTemplate = this.model.tempPlateDevice
      var vehicle = this.model.vehicleExtend
      if (vehicle.versionId) {
        this.vehicleVersion = `${vehicle.factoryName} / ${vehicle.brandName} / ${vehicle.versionName}`
      }
      this.brandName = vehicle.versionName || ''
    },
    showPopup(type, status = true) {
      this.popList[type] = status
      if (!this.currentPop || this.currentPop !== type) {
        this.keyword = ''
        if (type === 'finances') {
          this.$set(this.sourceList, type, this.finances)
        } else if (type === 'shops') {
          this.$set(this.sourceList, type, this.shops)
        } else {
          if (this.hasOwnProperty(type)) {
            this.$set(this.sourceList, type, this[type])
          }
        }
      }
      this.currentPop = type
    },
    changeOrderType(checked) {
      if (checked) {
        this.model.ownerType = 2
        this.$set(this.model, 'cardType', 5)
      } else {
        this.model.ownerType = 1
        this.cardType = '身份证'
        this.$set(this.model, 'cardType', 1)
      }
    },
    changeShop(value) {
      //经销商变更
      this.currentShop = value
      this.model.shopName = value.text
      // this.model.shopId = value.id
      if (this.model.installExtend.addressType === 1) {
        this.model.installExtend.address = value.address
      }
      this.$set(this.model, 'shopId', value.id)
      this.popList.shops = false
      shopDetail(value.id).then((json) => {
        this.currentShop.bitwise = json
        this.jieyiRule()
      })
      //驻店员
      icbSaleList(value.id).then((json) => {
        if (!json || json.length === 0) {
          value.disabled = true
          this.icbSaleList = []
          this.changeIcbSale()
          this.$toast('该经销商没有驻店员,请重新选择')
          return
        }
        if (this.model.acbSaleId) {
          var item = json.find((e) => e.id === this.model.acbSaleId) || {
            id: this.model.acbSaleId,
            text: this.model.acbSaleName,
            mobile: this.model.acbSaleMobile,
          }
          this.changeIcbSale(item)
        } else {
          this.changeIcbSale(json[0])
        }
        this.icbSaleList = json
      })
      //本店销售
      saleList(value.id).then((json) => {
        if (!json || json.length === 0) {
          value.disabled = true
          this.saleList = this.sourceList.saleList = []
          this.currentSale = { text: '' }
          this.model.shopSaleId = ''
          this.changeSale()
          this.$toast('该经销商没有销售员,请重新选择')
          return
        }
        if (this.model.shopSaleId) {
          var item = json.find((e) => e.id === this.model.shopSaleId) || {
            id: this.model.shopSaleId,
            text: this.model.shopSaleName,
            mobile: this.model.shopSaleMobile,
          }
          this.changeSale(item)
        } else {
          this.changeSale()
        }
        this.saleList = this.sourceList.saleList = json
      })
      templates(value.id).then((json) => {
        if (!json || json.length === 0) {
          value.disabled = true
          this.templates = []
          this.changeTemplate()
          this.$toast('该经销商没有可用的服务模板')
          return
        }
        if (this.model.templateId) {
          var item = json.find((e) => e.id === this.model.templateId) || {
            id: this.model.templateId,
            text: this.model.templateName,
            month: this.model.year * 12,
          }
          this.changeTemplate(item)
        }
        this.templates = json
      })
    },
    changeIcbSale(value) {
      if (!value) {
        this.currentIcbSale = ''
        this.model.acbSaleId = ''
        if (this.model.installExtend.contractType === 0) {
          this.model.installExtend.contractName = ''
          this.model.installExtend.contractMobile = ''
        }
        return
      }
      this.currentIcbSale = value
      this.model.acbSaleId = value.id
      if (this.model.installExtend.contractType === 0) {
        this.model.installExtend.contractName = value.text
        this.model.installExtend.contractMobile = value.mobile
      }
      // this.popList.icbSales = false
      this.$set(this.popList, 'icbSales', false)
    },
    changeSale(value) {
      if (!value) {
        this.currentSale = { text: '' }
        this.model.shopSaleId = ''
        return
      }
      this.currentSale = value
      this.model.shopSaleId = value.id
      // this.popList.sales = false
      this.$set(this.popList, 'saleList', false)
    },
    changeInsurance(value) {
      //变更保险公司
      this.model.electronPolicySupplierName = value.text
      this.model.electronPolicySupplierId = value.id
      this.jieyiRule()
      this.$set(this.model, 'electronPolicySupplierId', value.id)
      this.popList.insurances = false
    },
    changeTemplate(value) {
      if (!value) {
        this.currentTemplate = { text: '' }
        this.model.templateId = ''
        this.model.year = 1
        return
      }
      this.currentTemplate = value
      this.model.templateId = value.id
      this.model.year = value.month / 12
      this.changeServiceStart(this.model.serviceStart)
      this.popList.templates = false
    },
    changeIDType(value) {
      this.cardType = value.text
      this.model.cardType = value.type
      this.popList.idType = false
    },
    changeContactType(value) {
      //备用联系人
      this.model.spareRelation = value
      this.popList.contactType = false
    },
    changeVehicleType() {
      //修改车辆类型 todo 存储之前的选择
      //重置车型
      this.model.vehicleExtend.factoryId = ''
      this.model.vehicleExtend.factoryName = ''
      this.model.vehicleExtend.brandId = ''
      this.model.vehicleExtend.brandName = ''
      this.model.vehicleExtend.versionId = ''
      this.model.vehicleExtend.versionName = ''
      this.vehicleVersion = ''
      //重置车型配置
      this.configList = []
      this.model.vehicleExtend.configId = ''
      this.model.vehicleExtend.configName = ''
      //重置设备模板
      this.model.installExtend.templateDeviceId = ''
      this.deviceTemplate = ''
    },
    changePaymode(value, index, remark = '') {
      this.paymode = value.text
      this.model.payType = value.type
      if (value.type === 6 || value.type === 3) {
        this.model.payRemark = value.text
      } else {
        this.model.payRemark = remark
      }
      this.popList.paymode = false
    },
    changeInstallContact(value) {
      //安装联系人
      this.installContact = value.text
      this.model.installExtend.ContractType = value.type
      if (value.type === 0) {
        this.model.installExtend.contractName = this.currentIcbSale.text
        this.model.installExtend.contractMobile = this.currentIcbSale.mobile
      } else if (value.type === 1) {
        this.model.installExtend.contractName = this.currentSale.text || ''
        this.model.installExtend.contractMobile = this.currentSale.mobile || ''
      } else if (value.type === 2) {
        this.model.installExtend.contractName = this.model.ownerName || ''
        this.model.installExtend.contractMobile = this.model.ownerMobile || ''
      } else if (value.type === 3) {
        this.model.installExtend.contractName = this.model.spareName || ''
        this.model.installExtend.contractMobile = this.model.spareMobile || ''
      } else {
        this.model.installExtend.contractName = ''
        this.model.installExtend.contractMobile = ''
      }
      this.popList.installContact = false
    },
    changeInstallAddressType(value) {
      if (value === 1) {
        //店内
        this.model.installExtend.address = this.currentShop.address
      } else {
        //上门
        this.model.installExtend.address = ''
      }
    },
    changeBuyTime(date) {
      this.model.vehicleExtend.buyTime = date
      this.popList.buyTime = false
    },
    changeServiceStart(date) {
      this.model.serviceStart = date || new Date().addDays(1)
      var end = new Date(date)
      end.setMonth(end.getMonth() + this.currentTemplate.month)
      this.$set(this.model, 'serviceEnd', end.addDays(-1))
      this.popList.serviceStart = false
    },
    changeFinanceUnit(value) {
      //金融公司
      this.model.vehicleExtend.financeId = value.id
      this.model.vehicleExtend.financeName = value.text
      this.popList.finances = false
      //金融备注
      financeRemark(this.currentShop.id, value.id).then((remark) => {
        this.model.vehicleExtend.financeRemark = remark ? remark : value.remark
      })
    },
    changeVin(value) {
      this.model.vehicleExtend.vin = value
      this.popList.vins = false
    },
    changeEngine(value) {
      this.model.vehicleExtend.engineNumber = value
      this.popList.engines = false
    },
    changeFactory(value) {
      this.model.vehicleExtend.factoryNumber = value
      this.popList.factories = false
    },
    handleUploadIdCard(file) {
      //身份证识别
      // console.log(file) //content,file
      var ocrType = -1 //身份证
      if (this.model.cardType === 1) {
        ocrType = 0
      } else if (this.model.cardType === 2) {
        //驾驶证
        ocrType = 1
      } else if (this.model.cardType === 4) {
        //护照
        ocrType = 7
      }
      if (ocrType >= 0) {
        this.$toast.loading({
          message: '识别中...',
        })
        return ocr(file.file, ocrType)
          .then((json) => {
            // console.log(json)
            this.model.cardPicture = json.url
            if (Object.keys(json.words).length > 0) {
              this.model.ownerName = json.words.name
              if (!this.model.beneficiary) {
                this.model.beneficiary = json.words.name
              }
              this.model.cardNumber = json.words.idno
              if (json.words.sex) {
                var sex = json.words.sex == '男' ? 1 : 2
                this.$set(this.model, 'sex', sex) //刷新数据
              }
            }
            this.$toast.clear()
            // address: "广州市增城区荔城街滨海路8号702房"
            // birthday: "1991-04-02"
            // idno: "440183199104026117"
            // name: "丁霖"
            // nation: "汉"
            // sex: "男"
          })
          .catch(() => {
            this.$toast({
              message: '证件照识别失败',
              position: 'bottom',
              duration: 2000,
            })
          })
      } else {
        this.$toast.loading({
          message: '上传中...',
        })
        return upload(file.file)
          .then((json) => {
            this.model.cardPicture = json
            this.$toast.clear()
          })
          .catch(() => {
            this.$toast({
              message: '证件照上传失败',
              position: 'bottom',
              duration: 2000,
            })
          })
      }
    },
    handleDeleteIdCard() {
      //删除证件照
      return Dialog.confirm({ message: '确定要删除证件照？' }).then(() => {
        this.model.vehicleExtend.cardPicture = ''
      })
    },
    handleUploadBusiLicense(file) {
      //营业执照
      // console.log(file)
      var loading = this.$toast.loading({
        message: '识别中...',
      })
      return ocr(file.file, 3)
        .then((json) => {
          // console.log(json)
          this.model.cardPicture = json.url
          if (Object.keys(json.words).length > 0) {
            if (json.words.expired) {
              var expired = new Date(
                json.words.expired
                  .replace('年', '/')
                  .replace('月', '/')
                  .replace('日', '')
              )
              if (expired < new Date()) {
                loading = null
                this.$toast.fail('该营业执照已过期')
                return
              }
            }
            this.model.ownerName = json.words.name
            this.model.cardNumber = json.words.number
          }
          // address: "苏州市经济开发区百丽花园223"
          // creditCode: "556344445002102"
          // expired: "2015年12月20日"
          // legal: "于松仙"
          // name: "苏州万花筒广告有限公司"
          // number: "398749230833865123"
          // type: "无"
          loading.clear()
        })
        .catch(() => {
          this.$toast({
            message: '营业执照识别失败',
            position: 'bottom',
            duration: 2000,
          })
        })
    },
    handleDeleteBusiLicense() {
      //删除营业执照
      return Dialog.confirm({ message: '确定要删除营业执照？' }).then(() => {
        this.model.cardPicture = ''
      })
    },
    handleUploadInvoice(file) {
      //机动车发票
      // console.log(file)
      this.$toast.loading({
        message: '识别中...',
      })
      return ocr(file.file, 5)
        .then((json) => {
          // console.log(json)
          this.$toast.clear()
          this.model.vehicleExtend.invoice = json.url
          if (Object.keys(json.words).length == 0) return
          this.model.insuredAmount = this.model.vehicleExtend.ivoiceAmount = (
            parseFloat(json.words.price) / 10000.0
          ).toString()
          this.fillOcr(
            json.words.frameno,
            json.words.engineno,
            json.words.brandModel
          )
          this.$set(
            this.model.vehicleExtend,
            'buyTime',
            toDate(json.words.date)
          )
          // brandModel: "GTM6491HWM"
          // code: "144001924160"
          // date: "2019-04-11"
          // engineno: "4034640"
          // frameno: "LVGEN56A9KG323491"
          // idno: "91440106693564190B"
          // name: "广州市颂霖广告有限公司"
          // number: "00148453"
          // place: "广州"
          // price: "301800.00"
          // tax: "34720.35"
          // type: "多用途乘用车"
        })
        .catch(() => {
          this.$toast({
            message: '机动车发票/合同识别失败',
            position: 'bottom',
            duration: 2000,
          })
        })
    },
    handleDeleteInvoice() {
      //删除机动车发票
      return Dialog.confirm({ message: '确定要删除机动车发票？' }).then(() => {
        this.model.vehicleExtend.invoice = ''
      })
    },
    handleUploadQc(file) {
      //车辆合格证
      this.$toast.loading({
        message: '识别中...',
      })
      // console.log(file)
      return ocr(file.file, 4)
        .then((json) => {
          // console.log(json)
          this.model.vehicleExtend.certificate = json.url
          if (Object.keys(json.words).length > 0) {
            this.model.vehicleExtend.color = json.words.color
            this.brandName = json.words.brand
            this.fillOcr(
              json.words.frameno,
              json.words.engineno,
              json.words.brandModel
            )
          }
          this.$toast.clear()
          // this.$set(this.model.vehicleExtend, 'buyTime', json.words.date)
          // brand: "炫威牌/XR-V"
          // brandModel: "DHW7182RUCRE"
          // color: "雅韵金"
          // date: "2018-11-04"
          // displacement: "1799"
          // emission: "GB18352.5-2013国V"
          // engineno: "6069314"
          // frameno: "LVHRU5867J5069301"
          // fuel: "汽油"
          // power: "100"
          // totalPerson: "5"
        })
        .catch(() => {
          this.$toast({
            message: '车辆合格证识别失败',
            position: 'bottom',
            duration: 2000,
          })
        })
    },
    handleDeleteQc() {
      //删除车辆合格证
      return Dialog.confirm({ message: '确定要删除车辆合格证？' }).then(() => {
        this.model.vehicleExtend.certificate = ''
      })
    },
    handleUploadPayment(file) {
      //支付证明
      // console.log(file)
      this.$toast.loading({
        message: '上传中...',
      })
      return upload(file.file)
        .then((json) => {
          this.model.payPictures = json
          this.$toast.clear()
        })
        .catch(() => {
          this.$toast({
            message: '支付证明上传失败',
            position: 'bottom',
            duration: 2000,
          })
        })
    },
    handleDeletePayment() {
      //删除支付证明
      return Dialog.confirm({ message: '确定要删除支付证明？' }).then(() => {
        this.model.payPictures = ''
      })
    },
    handleUploadExtend(file) {
      //附件图片
      this.$toast.loading({
        message: '上传中...',
      })
      return upload(file.file)
        .then((json) => {
          this.model.extendPicture.push(json)
          this.$toast.clear()
        })
        .catch(() => {
          this.$toast({
            message: '附加图片上传失败',
            position: 'bottom',
            duration: 2000,
          })
        })
    },
    handleDeleteExtend(file, detail) {
      //删除附件图片
      return Dialog.confirm({ message: '确定要删除附件图片？' }).then(() => {
        this.model.extendPicture.splice(detail.index, 1)
      })
    },
    async handleSave(draft = false) {
      if (!draft) {
        //todo 表单验证
        const isValid = await this.$refs.observer.validate()
        if (!isValid) {
          this.$toast({
            message: '订单数据未通过验证,请修改',
            position: 'bottom',
            duration: 2000,
          })
          return false
        }
      }
      Dialog.confirm({
        message: draft ? '确认保存草稿？' : '确认提交订单？',
      }).then(() => {
        //提交
        this.model.draft = draft
        var postModel = Object.assign({}, this.model)
        postModel.installExtend = Object.assign({}, this.model.installExtend)
        postModel.vehicleExtend = Object.assign({}, this.model.vehicleExtend)
        postModel.extendPicture = Object.assign([], this.model.extendPicture)

        var loading = this.$toast.loading({
          message: '订单提交中...',
        })
        if (this.orderId) {
          edit(postModel)
            .then(() => {
              loading.clear()
              Dialog.alert({
                title: '操作提示',
                message: '编辑成功',
              }).then(() => {
                this.$router.push('/order/list')
              })
            })
            .catch(() => {
              this.$toast({
                type: 'fail',
                message: '编辑订单失败',
                position: 'bottom',
                duration: 2000,
              })
            })
        } else if (draft) {
          draftSave(postModel)
            .then(() => {
              loading.clear()
              Dialog.alert({
                title: '操作提示',
                message: '保存草稿成功',
              }).then(() => {
                this.$router.push('/order/draft')
              })
            })
            .catch(() => {
              this.$toast({
                type: 'fail',
                message: '保存草稿失败',
                position: 'bottom',
                duration: 2000,
              })
            })
        } else {
          create(postModel)
            .then(() => {
              loading.clear()
              Dialog.confirm({ message: '创建成功,是否继续录单？' })
                .then(() => {
                  this.$router.go(0)
                })
                .catch(() => {
                  this.$router.push('/order/list')
                })
            })
            .catch(() => {
              this.$toast({
                type: 'fail',
                message: '创建订单失败',
                position: 'bottom',
                duration: 2000,
              })
            })
        }
      })
    },
    handleShowVersionSelector() {
      //车型选择器
      this.scrollTop = window.scrollY
      this.popList.versionSelector = true
      this.showForm = false
    },
    handleCloseVersionSelector() {
      //关闭车型选择器
      this.popList.versionSelector = false
      this.showForm = true
      this.$nextTick(() => {
        window.scrollTo({ top: this.scrollTop })
      })
    },
    handleVersionSelect(version) {
      //选择车型
      this.popList.versionSelector = false
      this.showForm = true
      this.model.vehicleExtend.factoryId = version.factoryId
      this.model.vehicleExtend.factoryName = version.factory
      this.model.vehicleExtend.brandId = version.brandId
      this.model.vehicleExtend.brandName = version.brand
      this.model.vehicleExtend.versionId = version.id
      this.model.vehicleExtend.versionName = version.name
      this.vehicleVersion = version.desc
      this.model.vehicleExtend.configId = ''
      this.model.vehicleExtend.configName = ''
      //加载车型配置
      configList(version.id).then((json) => {
        this.configList = json
      })
      //加载设备模板
      deviceTemplate(this.currentShop.id, version.id).then((json) => {
        this.deviceTemplates = json
        if (json && json.length) {
          var tmp = json[0]
          this.model.installExtend.templateDeviceId = tmp.id
          this.deviceTemplate = tmp.text
        }
      })
      this.$nextTick(() => {
        window.scrollTo({ top: this.scrollTop })
      })
    },
    changeConfigList(value) {
      //车型配置选择
      // console.log(value)
      this.model.vehicleExtend.configId = value.id
      this.model.vehicleExtend.configName = value.text
      this.popList.configList = false
    },
    changeDeviceTemplate(value) {
      this.model.installExtend.templateDeviceId = value.id
      this.deviceTemplate = value.text
      this.popList.deviceTemplates = false
    },
    fillOcr(vin, engine, factory) {
      if (vin && this.ocrs.vins.indexOf(vin) < 0) {
        this.ocrs.vins.push(vin)
      }
      if (engine && this.ocrs.engines.indexOf(engine) < 0) {
        this.ocrs.engines.push(engine)
      }
      if (factory && this.ocrs.factories.indexOf(factory) < 0) {
        this.ocrs.factories.push(factory)
      }
      if (!this.model.vehicleExtend.vin && vin) {
        this.model.vehicleExtend.vin = vin
      }
      if (!this.model.vehicleExtend.engineNumber && engine) {
        this.model.vehicleExtend.engineNumber = engine
      }
      if (!this.model.vehicleExtend.factoryNumber && factory) {
        this.model.vehicleExtend.factoryNumber = factory
      }
    },
    handlePickerSearch(type) {
      var list = this[type]
      var result = []
      for (var index in list) {
        var item = list[index]
        if (!this.keyword || item.text.indexOf(this.keyword) >= 0) {
          result.push(item)
        }
      }
      this.$set(this.sourceList, type, result)
    },
    handleBack() {
      this.$router.go(-1)
    },
    jieyiRule() {
      //ZC可购买借意险
      this.jieyiState =
        this.model.electronPolicySupplierId ===
        '8e300e4451cf4990be387734f5bc5275'
      if (this.jieyiState) {
        if ((this.currentShop.bitwise & 512) > 0) {
          this.$set(this.model, 'jieyixian', true)
          this.jieyiState = false
        }
      } else {
        this.jieyiState = false
        this.$set(this.model, 'jieyixian', false)
      }
    },
  },
  watch: {
    'model.ownerName': function(val) {
      this.model.beneficiary = val
    },
  },
}
