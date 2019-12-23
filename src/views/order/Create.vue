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
        @click="showPopup('saleList')"
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
            :before-delete="handleDeleteBusiLicense"
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
            :before-delete="handleDeleteIdCard"
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
            :before-delete="handleDeleteInvoice"
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
            :before-delete="handleDeleteQc"
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
          :right-icon="ocrs.vins.length > 0 ? 'arrow-down' : ''"
          placeholder="请输入车架号"
          @click-right-icon="showPopup('vins')"
        />
        <van-field
          v-model="model.vehicleExtend.engineNumber"
          label="发动机号"
          required
          input-align="right"
          :right-icon="ocrs.engines.length > 0 ? 'arrow-down' : ''"
          placeholder="请输入发动机号"
          @click-right-icon="showPopup('engines')"
        />
        <van-field
          v-model="model.vehicleExtend.factoryNumber"
          label="厂牌型号"
          required
          input-align="right"
          :right-icon="ocrs.factories.length > 0 ? 'arrow-down' : ''"
          placeholder="请输入厂牌型号"
          @click-right-icon="showPopup('factories')"
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
            v-model="model.vehicleExtend.financeName"
            label="金融公司"
            required
            input-align="right"
            readonly
            is-link
            arrow-direction="down"
            placeholder="请选择金融公司"
            @click="showPopup('finances')"
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
            v-model="model.vehicleExtend.mortgageMonth"
            label="按揭期限"
            required
            readonly
            clickable
            type="number"
            input-align="right"
            placeholder="请输入按揭期限"
            @click="mortgageMonthShow = true"
            :class="{ 'd-warning': model.vehicleExtend.mortgageMonth > 50 }"
          >
            <div slot="right-icon" class="d-input-unit">月</div>
          </van-field>
          <van-number-keyboard
            v-model="model.vehicleExtend.mortgageMonth"
            theme="custom"
            close-button-text="完成"
            :show="mortgageMonthShow"
            :maxlength="3"
            @blur="mortgageMonthShow = false"
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
            :before-delete="handleDeletePayment"
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
            :before-delete="handleDeleteExtend"
          />
        </van-field>
      </van-cell-group>
    </div>
    <!--经销商-->
    <van-popup v-model="popList.shops" position="bottom">
      <van-picker
        show-toolbar
        title="选择经销商"
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
        title="驻店员"
        :columns="icbSaleList"
        :value="currentIcbSale.text"
        @cancel="showPopup('icbSales', false)"
        @confirm="changeIcbSale"
      />
    </van-popup>
    <!--销售员-->
    <van-popup v-model="popList.saleList" position="bottom">
      <van-picker
        show-toolbar
        title="本店销售"
        :columns="sourceList.saleList"
        :value="currentSale.text"
        @cancel="showPopup('saleList', false)"
        @confirm="changeSale"
      >
        <van-search
          v-model="keyword"
          clearable
          slot="title"
          placeholder="本店销售"
          show-action
          @search="handlePickerSearch('saleList')"
        >
          <div slot="action" @click="handlePickerSearch('saleList')">
            搜索
          </div>
        </van-search>
      </van-picker>
    </van-popup>
    <!--保险公司-->
    <van-popup v-model="popList.insurances" position="bottom">
      <van-picker
        show-toolbar
        title="保险公司"
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
        title="服务模板"
        :columns="templates"
        :value="currentTemplate.text"
        @cancel="showPopup('templates', false)"
        @confirm="changeTemplate"
      />
    </van-popup>
    <van-popup v-model="popList.idType" position="bottom">
      <van-picker
        show-toolbar
        title="证件类型"
        :columns="idTypes"
        :value="cardType"
        @cancel="showPopup('idType', false)"
        @confirm="changeIDType"
      />
    </van-popup>
    <van-popup v-model="popList.contactType" position="bottom">
      <van-picker
        :value="model.spareRelation"
        show-toolbar
        title="联系人类型"
        :columns="contactTypes"
        @cancel="showPopup('contactType', false)"
        @confirm="changeContactType"
      />
    </van-popup>
    <!--支付方式-->
    <van-popup v-model="popList.paymode" position="bottom">
      <van-picker
        :value="paymode"
        show-toolbar
        title="支付方式"
        :columns="paymodes"
        @cancel="showPopup('paymode', false)"
        @confirm="changePaymode"
      />
    </van-popup>
    <van-popup v-model="popList.installContact" position="bottom">
      <van-picker
        :value="installContact"
        show-toolbar
        title="安装联系人类型"
        :columns="installContacts"
        @cancel="showPopup('installContact', false)"
        @confirm="changeInstallContact"
      />
    </van-popup>
    <van-popup v-model="popList.buyTime" position="bottom">
      <van-datetime-picker
        :value="model.vehicleExtend.buyTime"
        title="购买时间"
        type="date"
        @cancel="showPopup('buyTime', false)"
        @confirm="changeBuyTime"
      />
    </van-popup>
    <van-popup v-model="popList.serviceStart" position="bottom">
      <van-datetime-picker
        :value="model.serviceStart"
        title="起保时间"
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
    <!--车型配置-->
    <van-popup v-model="popList.configList" position="bottom">
      <van-picker
        show-toolbar
        :value="model.vehicleExtend.configName"
        :columns="sourceList.configList"
        @cancel="showPopup('configList', false)"
        @confirm="changeConfigList"
      >
        <van-search
          v-model="keyword"
          clearable
          slot="title"
          placeholder="车型配置"
          show-action
          @search="handlePickerSearch('configList')"
        >
          <div slot="action" @click="handlePickerSearch('configList')">
            搜索
          </div>
        </van-search>
      </van-picker>
    </van-popup>
    <!--金融公司-->
    <van-popup v-model="popList.finances" position="bottom">
      <van-picker
        show-toolbar
        :value="model.vehicleExtend.financeName"
        :columns="sourceList.finances"
        @cancel="showPopup('finances', false)"
        @confirm="changeFinanceUnit"
      >
        <van-search
          v-model="keyword"
          clearable
          slot="title"
          placeholder="金融公司"
          show-action
          @search="handlePickerSearch('finances')"
        >
          <div slot="action" @click="handlePickerSearch('finances')">
            搜索
          </div>
        </van-search>
      </van-picker>
    </van-popup>
    <van-popup v-model="popList.vins" position="bottom">
      <van-picker
        show-toolbar
        title="车架号"
        :value="model.vehicleExtend.vin"
        :columns="ocrs.vins"
        @cancel="showPopup('vins', false)"
        @confirm="changeVin"
      />
    </van-popup>
    <van-popup v-model="popList.engines" position="bottom">
      <van-picker
        show-toolbar
        title="发动机号"
        :value="model.vehicleExtend.engineNumber"
        :columns="ocrs.engines"
        @cancel="showPopup('engines', false)"
        @confirm="changeEngine"
      />
    </van-popup>
    <van-popup v-model="popList.factories" position="bottom">
      <van-picker
        show-toolbar
        title="厂牌型号"
        :value="model.vehicleExtend.factoryNumber"
        :columns="ocrs.factories"
        @cancel="showPopup('factories', false)"
        @confirm="changeFactory"
      />
    </van-popup>
  </div>
</template>
<script>
import './create.less'
import { createOrder } from './create.js'
export default createOrder
</script>
