<template>
  <div>
    <van-nav-bar title="创建订单" :fixed="true" class="d-header" :z-index="10">
      <van-button slot="left" size="small" @click="handleSave(true)"
        >草稿</van-button
      >
      <van-button
        slot="right"
        size="small"
        type="primary"
        @click="handleSave(false)"
        >保存</van-button
      >
    </van-nav-bar>
    <menus active="new" />
    <div class="d-form" v-show="showForm">
      <van-field
        v-model="model.shopName"
        label="经销商"
        required
        input-align="right"
        readonly
        is-link
        arrow-direction="down"
        placeholder="请选择经销商"
        @click="showPopup('shops')"
      />
      <van-field
        v-model="currentIcbSale.text"
        label="驻店员"
        readonly
        required
        input-align="right"
        is-link
        arrow-direction="down"
        placeholder="请选择驻店员"
        @click="showPopup('icbSales')"
      />
      <van-field
        v-model="currentSale.text"
        label="本店销售"
        readonly
        required
        input-align="right"
        is-link
        arrow-direction="down"
        placeholder="请选择本店销售"
        @click="showPopup('sales')"
      />
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
        <van-field label="车主性别" required input-align="right">
          <van-radio-group slot="input" v-model="model.sex">
            <van-row type="flex" justify="end">
              <van-radio :name="1">男士</van-radio>
              <van-radio :name="2">女士</van-radio>
            </van-row>
          </van-radio-group>
        </van-field>
        <van-field
          v-model="model.spareRelation"
          label="联系人类型"
          input-align="right"
          readonly
          required
          is-link
          arrow-direction="down"
          placeholder="请选择备用联系人类型"
          @click="showPopup('contactType')"
        />
        <van-field
          v-model="model.spareName"
          label="备用联系人"
          input-align="right"
          placeholder="请输入备用联系人"
        />
        <van-field
          v-model="model.spareMobile"
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
          <van-radio-group
            slot="input"
            v-model="model.orderSource"
            @change="changeVehicleType"
          >
            <van-row type="flex" justify="end">
              <van-radio :name="4">汽车</van-radio>
              <van-radio :name="8">摩托车</van-radio>
            </van-row>
          </van-radio-group>
        </van-field>
        <van-switch-cell title="二手车" v-model="model.isUsedCar" />
        <van-field
          :value="vehicleVersion"
          label="车辆型号"
          input-align="right"
          readonly
          clickable
          is-link
          arrow-direction="down"
          placeholder="请选择车辆型号"
          @click="handleShowVersionSelector"
        />
        <van-field
          :value="model.vehicleExtend.configName"
          label="车型配置"
          input-align="right"
          readonly
          clickable
          is-link
          arrow-direction="down"
          placeholder="请选择车型配置"
          @click="showPopup('configList')"
        />
        <van-field label="车牌颜色" input-align="right">
          <van-radio-group
            slot="input"
            v-model="model.vehicleExtend.plateColor"
          >
            <van-row type="flex" justify="end">
              <van-radio name="蓝色">蓝色</van-radio>
              <van-radio name="绿色">绿色</van-radio>
              <van-radio name="其他">其他</van-radio>
            </van-row>
          </van-radio-group>
        </van-field>
        <van-field
          label="车牌号码"
          input-align="right"
          placeholder="请输入车牌号码"
        />
        <van-field
          v-model="model.vehicleExtend.vin"
          label="车架号"
          required
          input-align="right"
          placeholder="请输入车架号"
        />
        <van-field
          v-model="model.vehicleExtend.engineNumber"
          label="发动机号"
          required
          input-align="right"
          placeholder="请输入发动机号"
        />
        <van-field
          v-model="model.vehicleExtend.factoryNumber"
          label="厂牌型号"
          required
          input-align="right"
          placeholder="请输入厂牌型号"
        />
        <van-field
          v-model="model.vehicleExtend.color"
          label="车辆颜色"
          required
          input-align="right"
          placeholder="请输入车辆颜色"
        />
        <van-field
          :value="model.vehicleExtend.ivoiceAmount"
          label="开票金额"
          readonly
          clickable
          required
          input-align="right"
          placeholder="请输入开票金额"
          @click="invoiceAmountShow = true"
          :class="{ 'd-warning': model.vehicleExtend.ivoiceAmount > 200 }"
        >
          <div slot="right-icon" class="d-input-unit">万元</div>
        </van-field>
        <van-number-keyboard
          v-model="model.vehicleExtend.ivoiceAmount"
          theme="custom"
          extra-key="."
          close-button-text="完成"
          :show="invoiceAmountShow"
          :maxlength="9"
          @blur="invoiceAmountShow = false"
        />
        <van-field
          :value="model.vehicleExtend.buyTime | formatDate('yyyy-MM-dd')"
          label="购买日期"
          required
          readonly
          clickable
          input-align="right"
          placeholder="请选择购买日期"
          @click="showPopup('buyTime')"
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
            v-model="model.vehicleExtend.mortgageAmount"
            label="按揭金额"
            readonly
            clickable
            required
            input-align="right"
            placeholder="请输入按揭金额"
            @click="mortgageAmountShow = true"
            :class="{ 'd-warning': model.vehicleExtend.mortgageAmount > 200 }"
          >
            <div slot="right-icon" class="d-input-unit">万元</div>
          </van-field>
          <van-number-keyboard
            v-model="model.vehicleExtend.mortgageAmount"
            theme="custom"
            extra-key="."
            close-button-text="完成"
            :show="mortgageAmountShow"
            :maxlength="9"
            @blur="mortgageAmountShow = false"
          />
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
          v-model="model.electronPolicySupplierName"
          label="保险公司"
          input-align="right"
          readonly
          required
          is-link
          arrow-direction="down"
          placeholder="请选择保险公司"
          @click="showPopup('insurances')"
        />
        <van-field
          v-if="!model.isElectronPolicy"
          required
          label="保险函号"
          input-align="right"
          placeholder="请输入保险函号"
        />
        <van-field
          v-model="model.insuredAmount"
          label="保障金额"
          readonly
          clickable
          required
          input-align="right"
          placeholder="请输入保障金额"
          @click="insuredAmountShow = true"
          :class="{ 'd-warning': model.insuredAmount > 200 }"
        >
          <div slot="right-icon" class="d-input-unit">万元</div>
        </van-field>
        <van-number-keyboard
          v-model="model.insuredAmount"
          theme="custom"
          extra-key="."
          close-button-text="完成"
          :show="insuredAmountShow"
          :maxlength="9"
          @blur="insuredAmountShow = false"
        />
        <van-field
          v-model="model.beneficiary"
          label="第一受益人"
          required
          input-align="right"
          placeholder="请输入第一受益人"
        />
        <van-field
          v-model="currentTemplate.text"
          label="服务模板"
          required
          input-align="right"
          readonly
          is-link
          arrow-direction="down"
          placeholder="请选择服务模板"
          @click="showPopup('templates')"
        />
        <van-field
          :value="model.serviceStart | formatDate('yyyy-MM-dd')"
          label="起保时间"
          readonly
          required
          clickable
          input-align="right"
          placeholder="请选择起保时间"
          @click="showPopup('serviceStart')"
        />
        <van-field
          :value="model.serviceEnd | formatDate('yyyy-MM-dd')"
          label="止保时间"
          readonly
          input-align="right"
        />
        <van-field
          :value="model.receivableAmount"
          label="应收费用"
          required
          readonly
          input-align="right"
          placeholder="请输入应收费用"
          @click="receivableAmountShow = true"
          :class="{ 'd-warning': model.receivableAmount > 20000 }"
        >
          <div slot="right-icon" class="d-input-unit">元</div>
        </van-field>
        <van-number-keyboard
          v-model="model.receivableAmount"
          theme="custom"
          extra-key="."
          close-button-text="完成"
          :show="receivableAmountShow"
          :maxlength="9"
          @blur="receivableAmountShow = false"
        />
        <van-field
          v-model="model.paidAmount"
          label="实收费用"
          required
          readonly
          input-align="right"
          placeholder="请输入实收费用"
          @click="paidAmountShow = true"
          :class="{ 'd-warning': model.paidAmount > 20000 }"
        >
          <div slot="right-icon" class="d-input-unit">元</div>
        </van-field>
        <van-number-keyboard
          v-model="model.paidAmount"
          theme="custom"
          extra-key="."
          close-button-text="完成"
          :show="paidAmountShow"
          :maxlength="9"
          @blur="paidAmountShow = false"
        />
        <van-field
          v-model="model.handlePaidAmount"
          label="保函显示费用"
          required
          readonly
          input-align="right"
          placeholder="请输入保函显示费用"
          @click="handlePaidAmountShow = true"
          :class="{ 'd-warning': model.handlePaidAmount > 20000 }"
        >
          <div slot="right-icon" class="d-input-unit">元</div>
        </van-field>
        <van-number-keyboard
          v-model="model.handlePaidAmount"
          theme="custom"
          extra-key="."
          close-button-text="完成"
          :show="handlePaidAmountShow"
          :maxlength="9"
          @blur="handlePaidAmountShow = false"
        />
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
        <van-field
          label="支付证明"
          :required="model.payType !== 3 && model.payType !== 6"
          input-align="right"
        >
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
        <van-switch-cell title="创建安装单" v-model="model.isCreateInstall" />
        <template v-if="model.isCreateInstall">
          <van-field label="安装地点" required input-align="right">
            <van-radio-group
              slot="input"
              v-model="model.installExtend.addressType"
              @change="changeInstallAddressType"
            >
              <van-row type="flex" justify="end">
                <van-radio :name="1">店内</van-radio>
                <van-radio :name="2">上门</van-radio>
              </van-row>
            </van-radio-group>
          </van-field>
          <van-field
            v-if="model.installExtend.addressType == 1"
            v-model="model.installExtend.address"
            label="店内地址"
            readonly
            input-align="right"
          />
          <van-field
            v-else
            v-model="model.installExtend.address"
            label="安装地址"
            required
            input-align="right"
            placeholder="请输入安装地址"
          />
          <van-field
            :value="deviceTemplate"
            label="安装设备"
            readonly
            input-align="right"
          />
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
            v-model="model.installExtend.contractName"
            label="联系人姓名"
            required
            input-align="right"
            placeholder="请输入联系人姓名"
          />
          <van-field
            v-model="model.installExtend.contractMobile"
            label="联系人电话"
            required
            input-align="right"
            placeholder="请输入联系人电话"
          />
        </template>
      </van-cell-group>
      <van-cell-group title="其他信息">
        <van-switch-cell title="凡车汇订单" v-model="model.isFch" />
        <van-switch-cell title="短信通知车主" v-model="model.isCreateOwner" />
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
    <!--经销商-->
    <van-popup v-model="popList.shops" position="bottom">
      <van-picker
        show-toolbar
        :columns="shops"
        :value="model.shopName"
        @cancel="showPopup('shops', false)"
        @confirm="changeShop"
      />
    </van-popup>
    <!--驻店员-->
    <van-popup v-model="popList.icbSales" position="bottom">
      <van-picker
        show-toolbar
        :columns="icbSaleList"
        :value="currentIcbSale.text"
        @cancel="showPopup('icbSales', false)"
        @confirm="changeIcbSale"
      />
    </van-popup>
    <!--销售员-->
    <van-popup v-model="popList.sales" position="bottom">
      <van-picker
        show-toolbar
        :columns="saleList"
        :value="currentSale.text"
        @cancel="showPopup('sales', false)"
        @confirm="changeSale"
      />
    </van-popup>
    <!--保险公司-->
    <van-popup v-model="popList.insurances" position="bottom">
      <van-picker
        show-toolbar
        :columns="insurances"
        :value="model.electronPolicySupplierName"
        @cancel="showPopup('insurances', false)"
        @confirm="changeInsurance"
      />
    </van-popup>
    <!--服务模板-->
    <van-popup v-model="popList.templates" position="bottom">
      <van-picker
        show-toolbar
        :columns="templates"
        :value="currentTemplate.text"
        @cancel="showPopup('templates', false)"
        @confirm="changeTemplate"
      />
    </van-popup>
    <van-popup v-model="popList.idType" position="bottom">
      <van-picker
        show-toolbar
        :columns="idTypes"
        :value="cardType"
        @cancel="showPopup('idType', false)"
        @confirm="changeIDType"
      />
    </van-popup>
    <van-popup v-model="popList.contactType" position="bottom">
      <van-picker
        show-toolbar
        :columns="contactTypes"
        :value="model.spareRelation"
        @cancel="showPopup('contactType', false)"
        @confirm="changeContactType"
      />
    </van-popup>
    <!--支付方式-->
    <van-popup v-model="popList.paymode" position="bottom">
      <van-picker
        show-toolbar
        :columns="paymodes"
        :value="paymode"
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
    <van-popup v-model="popList.buyTime" position="bottom">
      <van-datetime-picker
        :value="model.vehicleExtend.buyTime"
        type="date"
        @cancel="showPopup('buyTime', false)"
        @confirm="changeBuyTime"
      />
    </van-popup>
    <van-popup v-model="popList.serviceStart" position="bottom">
      <van-datetime-picker
        :value="model.serviceStart"
        type="date"
        @cancel="showPopup('serviceStart', false)"
        @confirm="changeServiceStart"
      />
    </van-popup>
    <van-popup
      v-model="popList.versionSelector"
      :overlay="false"
      class="d-version-selector"
    >
      <version-selector
        :type="model.orderSource"
        :brand="brandName"
        @cancel="handleCloseVersionSelector"
        @select="handleVersionSelect"
      />
    </van-popup>
    <van-popup v-model="popList.configList" position="bottom">
      <van-picker
        show-toolbar
        :value="model.vehicleExtend.configName"
        :columns="configList"
        @cancel="showPopup('configList', false)"
        @confirm="changeConfigList"
      />
    </van-popup>
  </div>
</template>
<script>
import Menus from '@/components/Menus'
import VersionSelector from '@/components/VersionSelector'
import { templates, deviceTemplate } from '@/services/order'
import { icbSaleList, saleList, configList } from '@/services/account'
import { ocr, upload } from '@/services/ocr'
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
  .use(DatetimePicker)
  .use(Uploader)
  .use(RadioGroup)
  .use(Radio)
  .use(Button)
  .use(Popup)
  .use(Icon)
export default {
  name: 'CreateOrder',
  components: {
    Menus,
    VersionSelector
  },
  data() {
    return {
      model: {
        ownerType: 1,
        cardType: 1,
        payRemark: '',
        vehicleExtend: {
          financeRemark: '',
          plateColor: '蓝色',
          buyTime: new Date()
        },
        installExtend: {
          addressType: 1,
          address: '',
          contractType: 0,
          contractName: '',
          contractMobile: ''
        },
        remark: '',
        orderSource: 4,
        isElectronPolicy: true,
        isCreateInstall: true,
        isCreateOwner: true,
        serviceStart: new Date().addDays(1),
        extendPicture: []
      },
      popList: {
        shops: false,
        icbSales: false,
        sales: false,
        idType: false,
        contactType: false,
        paymode: false,
        installContact: false,
        insurances: false,
        templates: false,
        buyTime: false,
        serviceStart: false,
        versionSelector: false,
        configList: false
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
        { type: 6, text: '港澳通行证' }
      ],
      contactTypes: ['家人', '同事', '朋友', '其他'],
      paymodes: [
        { type: 1, text: '支付宝' },
        { type: 2, text: '微信' },
        { type: 3, text: '对公转账' },
        { type: 4, text: '成都银行扫码' },
        { type: 5, text: 'POS机' },
        { type: 6, text: '月结' }
      ],
      installContacts: [
        { type: 0, text: '驻店员' },
        { type: 1, text: '销售顾问' },
        { type: 2, text: '车主' },
        { type: 3, text: '备用联系人' },
        { type: -1, text: '其他' }
      ],
      icbSaleList: [],
      saleList: [],
      templates: [],
      configList: [],
      previewIdCard: [],
      previewBusiLicense: [],
      previewInvoice: [],
      previewQc: [],
      previewPayment: [],
      previewExtend: [],
      invoiceAmountShow: false,
      mortgageAmountShow: false,
      insuredAmountShow: false,
      receivableAmountShow: false,
      paidAmountShow: false,
      handlePaidAmountShow: false
    }
  },
  computed: {
    ...mapGetters(['shops', 'insurances', 'carTypes', 'motoTypes'])
  },
  mounted() {
    this.$store.dispatch('getShops', () => {
      if (this.shops.length > 0) {
        var shop = this.shops[0]
        this.changeShop(shop)
      }
    })
    this.$store.dispatch('getInsurances', () => {
      if (this.insurances.length > 0) {
        this.changeInsurance(this.insurances[0])
      }
    })
    this.model.serviceStart = new Date().addDays(1)
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
    changeShop(value) {
      this.currentShop = value
      this.model.shopName = value.text
      // this.model.shopId = value.id
      if (this.model.installExtend.addressType === 1) {
        this.model.installExtend.address = value.address
      }
      this.$set(this.model, 'shopId', value.id)
      this.popList.shops = false
      //驻店员
      icbSaleList(value.id).then(json => {
        if (!json || json.length === 0) {
          value.disabled = true
          this.$toast('该经销商没有驻店员,请重新选择')
          return
        }
        this.changeIcbSale(json[0])
        this.icbSaleList = json
      })
      //本店销售
      saleList(value.id).then(json => {
        if (!json || json.length === 0) {
          value.disabled = true
          this.$toast('该经销商没有销售员,请重新选择')
          return
        }
        // this.changeSale(json[0])
        this.saleList = json
      })
      templates(value.id).then(json => {
        if (!json || json.length === 0) {
          value.disabled = true
          this.$toast('该经销商没有可用的服务模板')
          return
        }
        this.templates = json
      })
    },
    changeIcbSale(value) {
      this.currentIcbSale = value
      this.model.icbSaleId = value.id
      if (this.model.installExtend.contractType === 0) {
        this.model.installExtend.contractName = value.text
        this.model.installExtend.contractMobile = value.mobile
      }
      // this.popList.icbSales = false
      this.$set(this.popList, 'icbSales', false)
    },
    changeSale(value) {
      this.currentSale = value
      this.model.shopSaleId = value.id
      // this.popList.sales = false
      this.$set(this.popList, 'sales', false)
    },
    changeInsurance(value) {
      //保险公司
      this.model.electronPolicySupplierName = value.text
      this.model.electronPolicySupplierId = value.id
      this.$set(this.model, 'electronPolicySupplierId', value.id)
      this.popList.insurances = false
    },
    changeTemplate(value) {
      this.currentTemplate = value
      this.model.templateId = value.id
      this.model.year = value.month / 12
      this.changeServiceStart(this.model.serviceStart)
      this.popList.templates = false
    },
    changeIDType(value) {
      this.cardType = value.text
      this.model.cardType = value.type
      this.popList.changeShops = false
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
    changePaymode(value) {
      this.paymode = value.text
      this.model.payType = value.type
      if (value.type === 6 || value.type === 3) {
        this.model.payRemark = value.text
      } else {
        this.model.payRemark = ''
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
    handleUploadIdCard(file) {
      //身份证识别
      this.$toast.loading({
        message: '识别中...'
      })
      // console.log(file) //content,file
      ocr(file.file, 0)
        .then(json => {
          console.log(json)
          this.model.cardPicture = json.url
          if (Object.keys(json.words).length == 0) return
          this.model.ownerName = json.words.name
          if (!this.model.beneficiary) {
            this.model.beneficiary = json.words.name
          }
          this.model.cardNumber = json.words.idno
          var sex = json.words.sex == '男' ? 1 : 2
          this.$set(this.model, 'sex', sex) //刷新数据
          this.$toast.clear()
          // address: "广州市增城区荔城街滨海路8号702房"
          // birthday: "1991-04-02"
          // idno: "440183199104026117"
          // name: "丁霖"
          // nation: "汉"
          // sex: "男"
        })
        .catch(() => this.$toast.clear())
    },
    handleUploadBusiLicense(file) {
      //营业执照
      console.log(file)
    },
    handleUploadInvoice(file) {
      //机动车发票
      // console.log(file)
      this.$toast.loading({
        message: '识别中...'
      })
      ocr(file.file, 5)
        .then(json => {
          console.log(json)
          this.model.vehicleExtend.invoice = json.url
          if (Object.keys(json.words).length == 0) return
          this.model.insuredAmount = this.model.vehicleExtend.ivoiceAmount = (
            parseFloat(json.words.price) / 10000.0
          ).toString()
          if (!this.model.vehicleExtend.vin) {
            this.model.vehicleExtend.vin = json.words.frameno
          }
          this.model.vehicleExtend.engineNumber = json.words.engineno
          this.model.vehicleExtend.factoryNumber = json.words.brandModel
          this.$set(this.model.vehicleExtend, 'buyTime', json.words.date)
          this.$toast.clear()
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
        .catch(() => this.$toast.clear())
    },
    handleUploadQc(file) {
      //车辆合格证
      console.log(file)
      ocr(file.file, 4).then(json => {
        console.log(json)
        this.model.vehicleExtend.certificate = json.url
        if (Object.keys(json.words).length == 0) return
        this.model.vehicleExtend.color = json.words.color
        this.brandName = json.words.brand
        // brand
        // this.model.vehicleExtend.vin = json.words.frameno
        // this.model.vehicleExtend.engineNumber = json.words.engineno
        // this.model.vehicleExtend.factoryNumber = json.words.brandModel
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
    },
    handleUploadPayment(file) {
      //支付证明
      console.log(file)
      upload(file.file).then(json => {
        this.model.payPictures = json
      })
    },
    handleUploadExtend(file) {
      //附件图片
      console.log(file)
      upload(file.file).then(json => {
        this.model.extendPicture.push(json)
      })
    },
    handleSave(draft = false) {
      this.model.draft = draft
      var postModel = Object.assign({}, this.model)
      postModel.installExtend = Object.assign({}, this.model.installExtend)
      postModel.vehicleExtend = Object.assign({}, this.model.vehicleExtend)
      postModel.extendPicture = Object.assign([], this.model.extendPicture)
      console.log(postModel)
      //todo 表单验证
    },
    handleShowVersionSelector() {
      this.scrollTop = window.scrollY
      this.popList.versionSelector = true
      this.showForm = false
    },
    handleCloseVersionSelector() {
      this.popList.versionSelector = false
      this.showForm = true
      this.$nextTick(() => {
        window.scrollTo({ top: this.scrollTop })
      })
    },
    handleVersionSelect(version) {
      this.popList.versionSelector = false
      this.showForm = true
      this.model.vehicleExtend.factoryId = version.factoryId
      this.model.vehicleExtend.factoryName = version.factory
      this.model.vehicleExtend.brandId = version.brandId
      this.model.vehicleExtend.brandName = version.brand
      this.model.vehicleExtend.versionId = version.id
      this.model.vehicleExtend.versionName = version.name
      this.vehicleVersion = version.desc
      //加载车型配置
      configList(version.id).then(json => {
        this.configList = json
      })
      //加载设备模板
      deviceTemplate(this.currentShop.id, version.id).then(json => {
        this.model.installExtend.templateDeviceId = json.id
        this.deviceTemplate = json.deviceName
      })
      this.$nextTick(() => {
        window.scrollTo({ top: this.scrollTop })
      })
    },
    changeConfigList(value) {
      //车型配置选择
      console.log(value)
      this.model.vehicleExtend.configId = value.id
      this.model.vehicleExtend.configName = value.text
      this.popList.configList = false
    }
  }
}
</script>
<style>
.d-error {
  background-color: #ff976a;
}
.d-error .van-field__control {
  color: #ee0a24;
  -webkit-text-fill-color: #ee0a24;
}
.d-error .d-input-unit {
  background-color: transparent;
}

.d-warning {
  background-color: #ffb;
}
.d-warning .d-input-unit {
  background-color: transparent;
}
.d-warning .van-field__control {
  color: #f82;
  -webkit-text-fill-color: #f82;
}
.van-uploader {
  padding: 10px 0;
}
.van-uploader__preview {
  margin: 0 1.2rem 1.2rem 0;
}
.van-radio {
  margin-left: 0.6rem;
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
.d-version-selector {
  width: 100%;
  height: 100%;
  position: absolute;
  transform: none;
  top: 0;
  left: 0;
}
</style>
