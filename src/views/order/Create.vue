<template>
  <div>
    <van-nav-bar :title="title" :fixed="true" class="d-header" :z-index="10">
      <van-button v-if="orderId" slot="left" size="small" @click="handleBack">
        返回
      </van-button>
      <van-button v-else slot="left" size="small" @click="handleSave(true)">
        草稿
      </van-button>
      <van-button
        slot="right"
        size="small"
        type="primary"
        @click="handleSave(false)"
      >
        保存
      </van-button>
    </van-nav-bar>
    <menus active="new" />
    <div class="d-form" v-show="showForm">
      <ValidationObserver
        ref="observer"
        tag="form"
        @submit.prevent="handleSave()"
        v-slot="{ invalid }"
      >
        <ValidationProvider name="经销商" rules="selected" v-slot="{ errors }">
          <van-field
            v-model="model.shopName"
            label="经销商"
            required
            input-align="right"
            readonly
            is-link
            arrow-direction="down"
            placeholder="请选择经销商"
            :error="errors.length > 0"
            @click="showPopup('shops')"
          />
        </ValidationProvider>
        <ValidationProvider name="驻店员" rules="selected" v-slot="{ errors }">
          <van-field
            v-model="currentIcbSale.text"
            label="驻店员"
            readonly
            required
            input-align="right"
            is-link
            arrow-direction="down"
            placeholder="请选择驻店员"
            :error="errors.length > 0"
            @click="showPopup('icbSales')"
          />
        </ValidationProvider>
        <ValidationProvider
          name="本店销售"
          rules="selected"
          v-slot="{ errors }"
        >
          <van-field
            v-model="currentSale.text"
            label="本店销售"
            readonly
            required
            input-align="right"
            is-link
            arrow-direction="down"
            placeholder="请选择本店销售"
            :error="errors.length > 0"
            @click="showPopup('saleList')"
          />
        </ValidationProvider>
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
          <ValidationProvider
            name="营业执照"
            :rules="isCompany ? 'updated' : ''"
            v-slot="{ errors }"
          >
            <van-field
              label="营业执照"
              required
              input-align="right"
              :error="errors.length > 0"
              :error-message="errors[0]"
            >
              <van-uploader
                slot="input"
                :max-count="1"
                v-model="previewBusiLicense"
                :after-read="handleUploadBusiLicense"
                :before-delete="handleDeleteBusiLicense"
              />
            </van-field>
          </ValidationProvider>
          <ValidationProvider
            name="证件号码"
            :rules="isCompany ? 'required' : ''"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.cardNumber"
              label="证件号码"
              required
              input-align="right"
              placeholder="请输入证件号码"
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="企业名称"
            :rules="isCompany ? 'required' : ''"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.ownerName"
              label="企业名称"
              required
              input-align="right"
              placeholder="请输入企业名称"
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="联系电话"
            :rules="isCompany ? 'required' : ''"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.ownerMobile"
              label="联系电话"
              required
              input-align="right"
              placeholder="请输入联系电话"
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="驾驶人"
            :rules="isCompany ? 'required' : ''"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.driverName"
              label="驾驶人"
              required
              input-align="right"
              placeholder="请输入驾驶人"
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="驾驶人电话"
            :rules="isCompany ? 'required|mobile' : ''"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.driverMobile"
              label="驾驶人电话"
              required
              type="number"
              input-align="right"
              placeholder="请输入驾驶人电话"
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
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
          <ValidationProvider
            name="证件照"
            :rules="isCompany ? '' : 'updated'"
            v-slot="{ errors }"
          >
            <van-field label="证件照" required input-align="right">
              <van-uploader
                slot="input"
                :max-count="1"
                v-model="previewIdCard"
                :after-read="handleUploadIdCard"
                :before-delete="handleDeleteIdCard"
              />
            </van-field>
          </ValidationProvider>
          <ValidationProvider
            name="证件号码"
            :rules="isCompany ? '' : 'required|idno'"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.cardNumber"
              label="证件号码"
              required
              input-align="right"
              placeholder="请输入证件号码"
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="车主姓名"
            :rules="isCompany ? '' : 'required'"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.ownerName"
              label="车主姓名"
              required
              input-align="right"
              placeholder="请输入车主姓名"
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="车主电话"
            :rules="isCompany ? '' : 'required'"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.ownerMobile"
              label="车主电话"
              required
              type="number"
              input-align="right"
              :error="errors.length > 0"
              :error-message="errors[0]"
              placeholder="请输入车主电话"
            />
          </ValidationProvider>
          <ValidationProvider
            name="车主性别"
            :rules="isCompany ? '' : 'selected'"
            v-slot="{ errors }"
          >
            <van-field
              label="车主性别"
              required
              input-align="right"
              :error="errors.length > 0"
            >
              <van-radio-group slot="input" v-model="model.sex">
                <van-row type="flex" justify="end">
                  <van-radio :name="1">男士</van-radio>
                  <van-radio :name="2">女士</van-radio>
                </van-row>
              </van-radio-group>
            </van-field>
          </ValidationProvider>
          <ValidationProvider
            name="联系人类型"
            :rules="isCompany ? '' : 'selected'"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.spareRelation"
              label="联系人类型"
              input-align="right"
              readonly
              required
              is-link
              arrow-direction="down"
              placeholder="请选择备用联系人类型"
              :error="errors.length > 0"
              @click="showPopup('contactType')"
            />
          </ValidationProvider>
          <van-field
            v-model="model.spareName"
            label="备用联系人"
            input-align="right"
            placeholder="请输入备用联系人"
          />
          <ValidationProvider
            name="联系人类型"
            :rules="isCompany ? '' : 'required'"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.spareMobile"
              label="联系人电话"
              required
              type="number"
              input-align="right"
              placeholder="请输入备用联系人电话"
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
        </van-cell-group>
        <van-cell-group class="d-vehicle" title="车辆信息">
          <ValidationProvider
            name="购车发票/合同"
            rules="updated"
            v-slot="{ errors }"
          >
            <van-field
              label="购车发票/合同"
              required
              label-width="120px"
              input-align="right"
              :error="errors.length > 0"
              :error-message="errors[0]"
            >
              <van-uploader
                slot="input"
                :max-count="1"
                v-model="previewInvoice"
                :after-read="handleUploadInvoice"
                :before-delete="handleDeleteInvoice"
              />
            </van-field>
          </ValidationProvider>
          <ValidationProvider
            name="车辆合格证"
            rules="updated"
            v-slot="{ errors }"
          >
            <van-field
              label="车辆合格证"
              required
              label-width="120px"
              input-align="right"
              :error="errors.length > 0"
              :error-message="errors[0]"
            >
              <van-uploader
                slot="input"
                :max-count="1"
                v-model="previewQc"
                :after-read="handleUploadQc"
                :before-delete="handleDeleteQc"
              />
            </van-field>
          </ValidationProvider>
          <ValidationProvider
            name="车辆类型"
            rules="selected"
            v-slot="{ errors }"
          >
            <van-field
              label="车辆类型"
              input-align="right"
              :error="errors.length > 0"
              :error-message="errors[0]"
            >
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
          </ValidationProvider>
          <van-switch-cell title="二手车" v-model="model.isUsedCar" />
          <ValidationProvider
            name="车辆型号"
            rules="selected"
            v-slot="{ errors }"
          >
            <van-field
              :value="vehicleVersion"
              label="车辆型号"
              input-align="right"
              readonly
              clickable
              is-link
              arrow-direction="down"
              placeholder="请选择车辆型号"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="handleShowVersionSelector"
            />
          </ValidationProvider>
          <ValidationProvider
            name="车型配置"
            rules="selected"
            v-slot="{ errors }"
          >
            <van-field
              :value="model.vehicleExtend.configName"
              label="车型配置"
              input-align="right"
              readonly
              clickable
              is-link
              arrow-direction="down"
              placeholder="请选择车型配置"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="showPopup('configList')"
            />
          </ValidationProvider>
          <ValidationProvider
            name="车牌颜色"
            rules="selected"
            v-slot="{ errors }"
          >
            <van-field
              label="车牌颜色"
              input-align="right"
              :error="errors.length > 0"
              :error-message="errors[0]"
            >
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
          </ValidationProvider>
          <van-field
            v-model="model.vehicleExtend.plateNumber"
            label="车牌号码"
            input-align="right"
            placeholder="请输入车牌号码"
          />
          <ValidationProvider
            name="车架号"
            rules="required"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.vehicleExtend.vin"
              label="车架号"
              required
              input-align="right"
              :right-icon="ocrs.vins.length > 0 ? 'arrow-down' : ''"
              placeholder="请输入车架号"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click-right-icon="showPopup('vins')"
            />
          </ValidationProvider>
          <ValidationProvider
            name="发动机号"
            rules="required"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.vehicleExtend.engineNumber"
              label="发动机号"
              required
              input-align="right"
              :right-icon="ocrs.engines.length > 0 ? 'arrow-down' : ''"
              placeholder="请输入发动机号"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click-right-icon="showPopup('engines')"
            />
          </ValidationProvider>
          <ValidationProvider
            name="厂牌型号"
            rules="required"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.vehicleExtend.factoryNumber"
              label="厂牌型号"
              required
              input-align="right"
              :right-icon="ocrs.factories.length > 0 ? 'arrow-down' : ''"
              placeholder="请输入厂牌型号"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click-right-icon="showPopup('factories')"
            />
          </ValidationProvider>
          <ValidationProvider
            name="车辆颜色"
            rules="required"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.vehicleExtend.color"
              label="车辆颜色"
              required
              input-align="right"
              placeholder="请输入车辆颜色"
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="开票金额"
            rules="required|amount"
            v-slot="{ errors }"
          >
            <van-field
              :value="model.vehicleExtend.ivoiceAmount"
              label="开票金额"
              readonly
              clickable
              required
              input-align="right"
              placeholder="请输入开票金额"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="invoiceAmountShow = true"
              :class="{ 'd-warning': model.vehicleExtend.ivoiceAmount > 200 }"
            >
              <div slot="right-icon" class="d-input-unit">万元</div>
            </van-field>
          </ValidationProvider>
          <van-number-keyboard
            v-model="model.vehicleExtend.ivoiceAmount"
            theme="custom"
            extra-key="."
            close-button-text="完成"
            :show="invoiceAmountShow"
            :maxlength="9"
            @blur="invoiceAmountShow = false"
          />
          <ValidationProvider
            name="购买日期"
            rules="selected"
            v-slot="{ errors }"
          >
            <van-field
              :value="model.vehicleExtend.buyTime | formatDate('yyyy-MM-dd')"
              label="购买日期"
              required
              readonly
              clickable
              input-align="right"
              placeholder="请选择购买日期"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="showPopup('buyTime')"
            />
          </ValidationProvider>
          <van-switch-cell title="按揭" v-model="model.isMortgage" />
          <div class="mortgage" v-if="model.isMortgage">
            <ValidationProvider
              name="金融公司"
              :rules="model.isMortgage ? 'selected' : ''"
              v-slot="{ errors }"
            >
              <van-field
                v-model="model.vehicleExtend.financeName"
                label="金融公司"
                required
                input-align="right"
                readonly
                is-link
                arrow-direction="down"
                placeholder="请选择金融公司"
                :error="errors.length > 0"
                :error-message="errors[0]"
                @click="showPopup('finances')"
              />
            </ValidationProvider>
            <ValidationProvider
              name="按揭金额"
              :rules="model.isMortgage ? 'required|amount' : ''"
              v-slot="{ errors }"
            >
              <van-field
                v-model="model.vehicleExtend.mortgageAmount"
                label="按揭金额"
                readonly
                clickable
                required
                input-align="right"
                placeholder="请输入按揭金额"
                :error="errors.length > 0"
                :error-message="errors[0]"
                @click="mortgageAmountShow = true"
                :class="{
                  'd-warning': model.vehicleExtend.mortgageAmount > 200
                }"
              >
                <div slot="right-icon" class="d-input-unit">万元</div>
              </van-field>
            </ValidationProvider>
            <van-number-keyboard
              v-model="model.vehicleExtend.mortgageAmount"
              theme="custom"
              extra-key="."
              close-button-text="完成"
              :show="mortgageAmountShow"
              :maxlength="9"
              @blur="mortgageAmountShow = false"
            />
            <ValidationProvider
              name="按揭期限"
              :rules="model.isMortgage ? 'required|integer' : ''"
              v-slot="{ errors }"
            >
              <van-field
                v-model="model.vehicleExtend.mortgageMonth"
                label="按揭期限"
                required
                readonly
                clickable
                type="number"
                input-align="right"
                placeholder="请输入按揭期限"
                :error="errors.length > 0"
                :error-message="errors[0]"
                @click="mortgageMonthShow = true"
                :class="{ 'd-warning': model.vehicleExtend.mortgageMonth > 50 }"
              >
                <div slot="right-icon" class="d-input-unit">月</div>
              </van-field>
            </ValidationProvider>
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
          <ValidationProvider
            name="保险公司"
            :rules="model.isElectronPolicy ? 'selected' : ''"
            v-slot="{ errors }"
          >
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
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="showPopup('insurances')"
            />
          </ValidationProvider>
          <ValidationProvider
            name="保险函号"
            :rules="model.isElectronPolicy ? '' : 'required'"
            v-slot="{ errors }"
          >
            <van-field
              v-if="!model.isElectronPolicy"
              required
              label="保险函号"
              input-align="right"
              placeholder="请输入保险函号"
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="保障金额"
            rules="required|amount"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.insuredAmount"
              label="保障金额"
              readonly
              clickable
              required
              input-align="right"
              placeholder="请输入保障金额"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="insuredAmountShow = true"
              :class="{ 'd-warning': model.insuredAmount > 200 }"
            >
              <div slot="right-icon" class="d-input-unit">万元</div>
            </van-field>
          </ValidationProvider>
          <van-number-keyboard
            v-model="model.insuredAmount"
            theme="custom"
            extra-key="."
            close-button-text="完成"
            :show="insuredAmountShow"
            :maxlength="9"
            @blur="insuredAmountShow = false"
          />
          <ValidationProvider
            name="第一受益人"
            rules="required"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.beneficiary"
              label="第一受益人"
              required
              input-align="right"
              placeholder="请输入第一受益人"
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
          <ValidationProvider
            name="服务模板"
            rules="selected"
            v-slot="{ errors }"
          >
            <van-field
              v-model="currentTemplate.text"
              label="服务模板"
              required
              input-align="right"
              readonly
              is-link
              arrow-direction="down"
              placeholder="请选择服务模板"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="showPopup('templates')"
            />
          </ValidationProvider>
          <ValidationProvider
            name="起保时间"
            rules="selected"
            v-slot="{ errors }"
          >
            <van-field
              :value="model.serviceStart | formatDate('yyyy-MM-dd')"
              label="起保时间"
              readonly
              required
              clickable
              input-align="right"
              placeholder="请选择起保时间"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="showPopup('serviceStart')"
            />
          </ValidationProvider>
          <van-field
            :value="model.serviceEnd | formatDate('yyyy-MM-dd')"
            label="止保时间"
            readonly
            input-align="right"
          />
          <ValidationProvider
            name="应收费用"
            rules="required|amount"
            v-slot="{ errors }"
          >
            <van-field
              :value="model.receivableAmount"
              label="应收费用"
              required
              readonly
              input-align="right"
              placeholder="请输入应收费用"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="receivableAmountShow = true"
              :class="{ 'd-warning': model.receivableAmount > 20000 }"
            >
              <div slot="right-icon" class="d-input-unit">元</div>
            </van-field>
          </ValidationProvider>
          <van-number-keyboard
            v-model="model.receivableAmount"
            theme="custom"
            extra-key="."
            close-button-text="完成"
            :show="receivableAmountShow"
            :maxlength="9"
            @blur="receivableAmountShow = false"
          />
          <ValidationProvider
            name="实收费用"
            rules="required|amount"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.paidAmount"
              label="实收费用"
              required
              readonly
              input-align="right"
              placeholder="请输入实收费用"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="paidAmountShow = true"
              :class="{ 'd-warning': model.paidAmount > 20000 }"
            >
              <div slot="right-icon" class="d-input-unit">元</div>
            </van-field>
          </ValidationProvider>
          <van-number-keyboard
            v-model="model.paidAmount"
            theme="custom"
            extra-key="."
            close-button-text="完成"
            :show="paidAmountShow"
            :maxlength="9"
            @blur="paidAmountShow = false"
          />
          <ValidationProvider
            name="保函显示费用"
            rules="required|amount"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.handlePaidAmount"
              label="保函显示费用"
              required
              readonly
              input-align="right"
              placeholder="请输入保函显示费用"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="handlePaidAmountShow = true"
              :class="{ 'd-warning': model.handlePaidAmount > 20000 }"
            >
              <div slot="right-icon" class="d-input-unit">元</div>
            </van-field>
          </ValidationProvider>
          <van-number-keyboard
            v-model="model.handlePaidAmount"
            theme="custom"
            extra-key="."
            close-button-text="完成"
            :show="handlePaidAmountShow"
            :maxlength="9"
            @blur="handlePaidAmountShow = false"
          />
          <ValidationProvider
            name="支付方式"
            rules="selected"
            v-slot="{ errors }"
          >
            <van-field
              v-model="paymode"
              label="支付方式"
              required
              input-align="right"
              readonly
              is-link
              arrow-direction="down"
              placeholder="请选择支付方式"
              :error="errors.length > 0"
              :error-message="errors[0]"
              @click="showPopup('paymode')"
            />
          </ValidationProvider>
          <ValidationProvider
            name="支付证明"
            :rules="model.payType !== 3 && model.payType !== 6 ? 'updated' : ''"
            v-slot="{ errors }"
          >
            <van-field
              label="支付证明"
              :required="model.payType !== 3 && model.payType !== 6"
              input-align="right"
              :error="errors.length > 0"
              :error-message="errors[0]"
            >
              <van-uploader
                slot="input"
                :max-count="1"
                v-model="previewPayment"
                :after-read="handleUploadPayment"
                :before-delete="handleDeletePayment"
              />
            </van-field>
          </ValidationProvider>
          <ValidationProvider
            name="支付备注"
            rules="required"
            v-slot="{ errors }"
          >
            <van-field
              v-model="model.payRemark"
              label="支付备注"
              required
              type="textarea"
              placeholder="请输入支付备注"
              maxlength="100"
              show-word-limit
              :error="errors.length > 0"
              :error-message="errors[0]"
            />
          </ValidationProvider>
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
                  <van-radio :name="0">店内</van-radio>
                  <van-radio :name="1">上门</van-radio>
                </van-row>
              </van-radio-group>
            </van-field>
            <van-field
              v-if="model.installExtend.addressType === 0"
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
            <ValidationProvider
              name="联系人类型"
              rules="selected"
              v-slot="{ errors }"
            >
              <van-field
                v-model="installContact"
                label="联系人类型"
                required
                input-align="right"
                readonly
                is-link
                arrow-direction="down"
                placeholder="请选择联系人类型"
                :error="errors.length > 0"
                :error-message="errors[0]"
                @click="showPopup('installContact')"
              />
            </ValidationProvider>
            <ValidationProvider
              name="联系人姓名"
              rules="required"
              v-slot="{ errors }"
            >
              <van-field
                v-model="model.installExtend.contractName"
                label="联系人姓名"
                required
                input-align="right"
                placeholder="请输入联系人姓名"
                :error="errors.length > 0"
                :error-message="errors[0]"
              />
            </ValidationProvider>
            <ValidationProvider
              name="联系人电话"
              rules="required|mobile"
              v-slot="{ errors }"
            >
              <van-field
                v-model="model.installExtend.contractMobile"
                label="联系人电话"
                required
                input-align="right"
                placeholder="请输入联系人电话"
                :error="errors.length > 0"
                :error-message="errors[0]"
              />
            </ValidationProvider>
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
      </ValidationObserver>
    </div>
    <!--经销商-->
    <van-popup v-model="popList.shops" position="bottom">
      <van-picker
        show-toolbar
        title="选择经销商"
        :columns="sourceList.shops"
        :value="model.shopName"
        @cancel="showPopup('shops', false)"
        @confirm="changeShop"
      >
        <van-search
          v-if="shops.length > 5"
          v-model="keyword"
          clearable
          slot="title"
          placeholder="经销商"
          show-action
          @search="handlePickerSearch('shops')"
        >
          <div slot="action" @click="handlePickerSearch('shops')">
            搜索
          </div>
        </van-search>
      </van-picker>
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
