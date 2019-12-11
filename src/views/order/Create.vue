<template>
  <div>
    <van-nav-bar title="创建订单" :fixed="true" class="d-header" :z-index="10">
      <van-button slot="left" size="small">草稿</van-button>
      <van-button slot="right" size="small" type="primary">保存</van-button>
    </van-nav-bar>
    <menus active="new" />
    <div class="d-form">
      <van-switch-cell
        title="企业订单"
        v-model="isCompany"
        @change="changeOrderType"
      />
      <van-cell-group v-if="isCompany" title="企业信息">
        <van-field
          label="证件类型"
          input-align="right"
          value="统一社会信用代码"
        >
          <!-- <van-radio-group slot="input" v-model="model.cardType">
            <van-row type="flex" justify="end">
              <van-col>
                <van-radio :name="5">统一社会信用代码</van-radio>
              </van-col>
            </van-row>
          </van-radio-group> -->
        </van-field>
        <van-field label="营业执照" required input-align="right">
          <van-uploader
            slot="input"
            :max-count="1"
            v-model="previewBusiLicense"
            :after-read="handleUploadBusiLicense"
          />
        </van-field>
        <van-field
          label="证件号码"
          required
          input-align="right"
          placeholder="请输入证件号码"
        />
        <van-field
          label="企业名称"
          required
          input-align="right"
          placeholder="请输入企业名称"
        />
        <van-field
          label="联系电话"
          required
          input-align="right"
          placeholder="请输入联系电话"
        />
        <van-field
          label="驾驶人"
          required
          input-align="right"
          placeholder="请输入驾驶人"
        />
        <van-field
          label="驾驶人电话"
          required
          type="number"
          input-align="right"
          placeholder="请输入驾驶人电话"
        />
      </van-cell-group>
      <van-cell-group v-else class="d-person" title="车主信息">
        <van-field
          v-model="cardType"
          label="证件类型"
          input-align="right"
          readonly
          placeholder="请选择证件类型"
          is-link
          arrow-direction="down"
          @click="showPopup('idType')"
        />
        <van-field label="证件照" required input-align="right">
          <van-uploader
            slot="input"
            :max-count="1"
            v-model="previewIdCard"
            :after-read="handleUploadIdCard"
          />
        </van-field>
        <van-field
          v-model="model.cardNumber"
          label="证件号码"
          required
          input-align="right"
          placeholder="请输入证件号码"
        />
        <van-field
          v-model="model.ownerName"
          label="车主姓名"
          required
          input-align="right"
          placeholder="请输入车主姓名"
        />
        <van-field
          v-model="model.ownerMobile"
          label="车主电话"
          required
          type="number"
          input-align="right"
          placeholder="请输入车主电话"
        />
        <van-field label="车主性别" input-align="right">
          <van-radio-group slot="input" v-model="model.sex">
            <van-row type="flex" justify="end">
              <van-col :span="8">
                <van-radio :name="1">男士</van-radio>
              </van-col>
              <van-col :span="8">
                <van-radio :name="2">女士</van-radio>
              </van-col>
            </van-row>
          </van-radio-group>
        </van-field>
        <van-field
          v-model="contactType"
          label="联系人类型"
          input-align="right"
          readonly
          is-link
          arrow-direction="down"
          placeholder="请选择备用联系人类型"
          @click="showPopup('contactType')"
        />
        <van-field
          label="备用联系人"
          input-align="right"
          placeholder="请输入备用联系人"
        />
        <van-field
          label="联系人电话"
          required
          input-align="right"
          placeholder="请输入备用联系人电话"
        />
      </van-cell-group>
      <van-cell-group class="d-vehicle" title="车辆信息">
        <van-field
          label="购车发票/合同"
          required
          label-width="120px"
          input-align="right"
        >
          <van-uploader
            slot="input"
            :max-count="1"
            v-model="previewInvoice"
            :after-read="handleUploadInvoice"
          />
        </van-field>
        <van-field
          label="车辆合格证"
          required
          label-width="120px"
          input-align="right"
        >
          <van-uploader
            slot="input"
            :max-count="1"
            v-model="previewQc"
            :after-read="handleUploadQc"
          />
        </van-field>
        <van-field label="车辆类型" input-align="right">
          <van-radio-group slot="input" v-model="model.orderSource">
            <van-row type="flex" justify="end">
              <van-col :span="10">
                <van-radio :name="4">汽车</van-radio>
              </van-col>
              <van-col :span="10">
                <van-radio :name="8">摩托车</van-radio>
              </van-col>
            </van-row>
          </van-radio-group>
        </van-field>
        <van-switch-cell title="二手车" v-model="model.isUsedCar" />
        <van-field
          label="车辆型号"
          input-align="right"
          readonly
          is-link
          arrow-direction="down"
          placeholder="请选择车辆型号"
        />
        <van-field
          label="车型配置"
          input-align="right"
          readonly
          is-link
          arrow-direction="down"
          placeholder="请选择车型配置"
        />
        <van-field label="车牌颜色" input-align="right">
          <van-radio-group
            slot="input"
            v-model="model.vehicleExtend.plateColor"
          >
            <van-row type="flex" justify="end">
              <van-col :span="8">
                <van-radio name="蓝色">蓝色</van-radio>
              </van-col>
              <van-col :span="8">
                <van-radio name="绿色">绿色</van-radio>
              </van-col>
              <van-col :span="8">
                <van-radio name="其他">其他</van-radio>
              </van-col>
            </van-row>
          </van-radio-group>
        </van-field>
        <van-field
          label="车牌号码"
          input-align="right"
          placeholder="请输入车牌号码"
        />
        <van-field
          label="车架号"
          required
          input-align="right"
          placeholder="请输入车架号"
        />
        <van-field
          label="发动机号"
          required
          input-align="right"
          placeholder="请输入发动机号"
        />
        <van-field
          label="厂牌型号"
          required
          input-align="right"
          placeholder="请输入厂牌型号"
        />
        <van-field
          label="车辆颜色"
          required
          input-align="right"
          placeholder="请输入车辆颜色"
        />
        <van-field
          :value="model.vehicleExtend.invoiceAmount"
          label="开票金额"
          size="large"
          readonly
          clickable
          required
          input-align="right"
          placeholder="请输入开票金额"
          @touchstart.native.stop="invoiceAmountShow = true"
        >
          <div slot="right-icon" class="d-input-unit">万元</div>
        </van-field>
        <van-number-keyboard
          v-model="model.vehicleExtend.invoiceAmount"
          theme="custom"
          extra-key="."
          close-button-text="完成"
          :show="invoiceAmountShow"
          :maxlength="9"
          @blur="invoiceAmountShow = false"
        />
        <van-field
          label="购买日期"
          required
          readonly
          input-align="right"
          placeholder="请选择购买日期"
        />
        <van-switch-cell title="按揭" v-model="model.isMortgage" />
        <div class="mortgage" v-if="model.isMortgage">
          <van-field
            label="金融公司"
            required
            input-align="right"
            readonly
            is-link
            arrow-direction="down"
            placeholder="请选择金融公司"
          />
          <van-field
            label="按揭金额"
            required
            input-align="right"
            placeholder="请输入按揭金额"
          >
            <div slot="right-icon" class="d-input-unit">元</div>
          </van-field>
          <van-field
            label="按揭期限"
            required
            input-align="right"
            placeholder="请输入按揭期限"
          />
          <van-field
            v-model="model.vehicleExtend.financeRemark"
            label="金融备注"
            type="textarea"
            placeholder="请输入金融备注"
            maxlength="200"
            show-word-limit
          />
        </div>
      </van-cell-group>
      <van-cell-group title="保函信息">
        <van-switch-cell title="电子保函" v-model="model.isElectronPolicy" />
        <van-field
          v-if="model.isElectronPolicy"
          label="保险公司"
          input-align="right"
          readonly
          is-link
          arrow-direction="down"
          placeholder="请选择保险公司"
        />
        <van-field
          v-if="!model.isElectronPolicy"
          required
          label="保险函号"
          input-align="right"
          placeholder="请输入保险函号"
        />
        <van-field
          label="保障金额"
          required
          input-align="right"
          placeholder="请输入保障金额"
        >
          <div slot="right-icon" class="d-input-unit">元</div>
        </van-field>
        <van-field
          label="第一受益人"
          required
          input-align="right"
          placeholder="请输入第一受益人"
        />
        <van-field
          label="服务模板"
          required
          input-align="right"
          readonly
          is-link
          arrow-direction="down"
          placeholder="请选择服务模板"
        />
        <van-field
          label="起保时间"
          readonly
          required
          input-align="right"
          placeholder="请选择起保时间"
        />
        <van-field label="止保时间" readonly input-align="right" />
        <van-field
          label="应收费用"
          required
          input-align="right"
          placeholder="请输入应收费用"
        >
          <div slot="right-icon" class="d-input-unit">元</div>
        </van-field>
        <van-field
          label="实收费用"
          required
          input-align="right"
          placeholder="请输入实收费用"
        >
          <div slot="right-icon" class="d-input-unit">元</div>
        </van-field>
        <van-field
          label="保函显示费用"
          required
          input-align="right"
          placeholder="请输入保函显示费用"
        >
          <div slot="right-icon" class="d-input-unit">元</div>
        </van-field>
        <van-field
          v-model="paymode"
          label="支付方式"
          required
          input-align="right"
          readonly
          is-link
          arrow-direction="down"
          placeholder="请选择支付方式"
          @click="showPopup('paymode')"
        />
        <van-field label="支付证明" required input-align="right">
          <van-uploader
            slot="input"
            :max-count="1"
            v-model="previewPayment"
            :after-read="handleUploadPayment"
          />
        </van-field>
        <van-field
          v-model="model.payRemark"
          label="支付备注"
          required
          type="textarea"
          placeholder="请输入支付备注"
          maxlength="100"
          show-word-limit
        />
      </van-cell-group>
      <van-cell-group title="安装信息">
        <van-field label="安装地点" required input-align="right">
          <van-radio-group
            slot="input"
            v-model="model.installExtend.addressType"
          >
            <van-row type="flex" justify="end">
              <van-col :span="8">
                <van-radio :name="1">店内</van-radio>
              </van-col>
              <van-col :span="8">
                <van-radio :name="2">上门</van-radio>
              </van-col>
            </van-row>
          </van-radio-group>
        </van-field>
        <van-field
          v-if="model.installExtend.addressType == 1"
          label="店内地址"
          readonly
          input-align="right"
        />
        <van-field
          v-else
          label="安装地址"
          required
          input-align="right"
          placeholder="请输入安装地址"
        />
        <van-field label="安装设备" readonly input-align="right" />
        <van-field
          v-model="installContact"
          label="联系人类型"
          required
          input-align="right"
          readonly
          is-link
          arrow-direction="down"
          placeholder="请选择联系人类型"
          @click="showPopup('installContact')"
        />
        <van-field
          label="联系人姓名"
          required
          input-align="right"
          placeholder="请输入联系人姓名"
        />
        <van-field
          label="联系人电话"
          required
          input-align="right"
          placeholder="请输入联系人电话"
        />
        <van-switch-cell title="创建安装单" v-model="model.isCreateInstall" />
      </van-cell-group>
      <van-cell-group title="其他信息">
        <van-switch-cell title="凡车汇订单" v-model="model.isFch" />
        <van-switch-cell title="短信通知车主" v-model="model.IsCreateOwner" />
        <van-field
          label="经销商"
          required
          input-align="right"
          readonly
          is-link
          arrow-direction="down"
          placeholder="请选择经销商"
        />
        <van-field
          label="驻店员"
          readonly
          required
          input-align="right"
          is-link
          arrow-direction="down"
          placeholder="请选择驻店员"
        />
        <van-field
          label="本店销售"
          readonly
          required
          input-align="right"
          is-link
          arrow-direction="down"
          placeholder="请选择本店销售"
        />
        <van-field
          v-model="model.remark"
          label="订单备注"
          type="textarea"
          placeholder="请输入订单备注"
          maxlength="100"
          show-word-limit
        />
        <van-field label="附加图片" input-align="right">
          <van-uploader
            slot="input"
            :max-count="5"
            v-model="previewExtend"
            :after-read="handleUploadExtend"
          />
        </van-field>
      </van-cell-group>
      <!-- <div class="d-actions">
        <van-button>保存草稿</van-button>
        <van-button type="primary">创建订单</van-button>
      </div> -->
    </div>
    <van-popup v-model="popList.idType" position="bottom">
      <van-picker
        show-toolbar
        :columns="idTypes"
        @cancel="showPopup('idType', false)"
        @confirm="changeIDType"
      />
    </van-popup>
    <van-popup v-model="popList.contactType" position="bottom">
      <van-picker
        show-toolbar
        :columns="contactTypes"
        @cancel="showPopup('contactType', false)"
        @confirm="changeContactType"
      />
    </van-popup>
    <van-popup v-model="popList.paymode" position="bottom">
      <van-picker
        show-toolbar
        :columns="paymodes"
        @cancel="showPopup('paymode', false)"
        @confirm="changePaymode"
      />
    </van-popup>
    <van-popup v-model="popList.installContact" position="bottom">
      <van-picker
        show-toolbar
        :columns="installContacts"
        @cancel="showPopup('installContact', false)"
        @confirm="changeInstallContact"
      />
    </van-popup>
  </div>
</template>
<script>
import Menus from '@/components/Menus'
import { unitList } from '@/services/account'
import { ocr } from '@/services/ocr'
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
  Uploader,
  RadioGroup,
  Radio,
  Button,
  Popup,
  Icon
} from 'vant'
Vue.use(NavBar)
  .use(CellGroup)
  .use(SwitchCell)
  .use(Row)
  .use(Col)
  .use(Picker)
  .use(Field)
  .use(NumberKeyboard)
  .use(Uploader)
  .use(RadioGroup)
  .use(Radio)
  .use(Button)
  .use(Popup)
  .use(Icon)
export default {
  name: 'CreateOrder',
  components: {
    Menus
  },
  data() {
    return {
      model: {
        ownerType: 1,
        cardType: 1,
        payRemark: '',
        vehicleExtend: {
          financeRemark: '',
          plateColor: '蓝色'
        },
        installExtend: {
          addressType: 1,
          contractType: 2
        },
        remark: '',
        type: 0,
        orderSource: 4,
        isElectronPolicy: true,
        isCreateInstall: true,
        IsCreateOwner: true
      },
      popList: {
        idType: false,
        contactType: false,
        paymode: false,
        installContact: false
      },
      isCompany: false,
      cardType: '身份证',
      contactType: '',
      paymode: '',
      installContact: '驻店员',
      idTypes: ['身份证', '驾驶证', '军官证', '护照', '港澳通行证'],
      contactTypes: ['家人', '同事', '朋友', '其他'],
      paymodes: ['支付宝', '微信', '对公转账', '成都银行扫码', 'POS机', '月结'],
      installContacts: ['车主', '驻店员', '销售顾问', '备用联系人', '其他'],
      previewIdCard: [],
      previewBusiLicense: [],
      previewInvoice: [],
      previewQc: [],
      previewPayment: [],
      previewExtend: [],
      invoiceAmountShow: false
    }
  },
  mounted() {
    this.loadUnit()
  },
  methods: {
    showPopup(type, status = true) {
      this.popList[type] = status
    },
    changeOrderType(checked) {
      if (checked) {
        this.model.ownerType = 2
        this.model.cardType = 5
      } else {
        this.model.ownerType = 1
        this.model.cardType = 1
        this.cardType = '身份证'
      }
    },
    changeIDType(value, index) {
      this.cardType = value
      if (index == 4) this.model.cardType = 6
      else this.model.cardType = index + 1
      this.popList.idType = false
    },
    changeContactType(value, index) {
      this.contactType = value
      this.model.spareRelation = index
      this.popList.contactType = false
    },
    changePaymode(value, index) {
      this.paymode = value
      this.model.PayType = index + 1
      this.popList.paymode = false
    },
    changeInstallContact(value, index) {
      this.installContact = value
      this.model.installExtend.ContractType = index
      this.popList.installContact = false
    },
    handleUploadIdCard(file) {
      console.log(file) //content,file
      ocr(file.file, 0).then(json => {
        console.log(json)
      })
    },
    handleUploadBusiLicense(file) {
      console.log(file)
    },
    handleUploadInvoice(file) {
      console.log(file)
    },
    handleUploadQc(file) {
      console.log(file)
    },
    handleUploadPayment(file) {
      console.log(file)
    },
    handleUploadExtend(file) {
      console.log(file)
    },
    loadUnit(type = 1) {
      unitList(type).then(json => {
        console.log(json)
      })
    }
  }
}
</script>
<style>
.van-uploader {
  padding: 10px 0;
}
.van-uploader__preview {
  margin: 0 1.2rem 1.2rem 0;
}
.d-header {
  z-index: 2 !important;
  background-color: #fefefe;
}
.d-form {
  margin: 46px 0;
}
.d-input-unit {
  padding: 0 0.5rem;
  background-color: #eee;
}
.d-actions {
  text-align: right;
  background-color: #fefefe;
  padding: 1rem;
}
.d-actions .van-button {
  margin-left: 0.5rem;
}
</style>
