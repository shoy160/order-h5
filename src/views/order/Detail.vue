<template>
  <div>
    <van-nav-bar
      title="订单详情"
      :fixed="true"
      left-text="返回"
      left-arrow
      class="d-header"
      :z-index="100"
      @click-left="handleBack"
    >
      <div v-if="model.isElectronPolicy && model.state == 40" slot="right">
        <a
          :href="model.policyFile"
          class="van-button van-button--warning van-button--small"
          :download="name"
          target="_blank"
          id="download_link"
        >
          下载保单
        </a>
        <!-- <van-button size="small" type="warning" :url="model.policyFile">
          下载保单
        </van-button> -->
      </div>
    </van-nav-bar>
    <div class="d-container">
      <div class="d-content">
        <order-tags :model="model" />
        <van-row>
          <van-col span="8"><label>保险函号:</label></van-col>
          <van-col span="16">
            <span>
              {{ model.policyNumber }}
            </span>
          </van-col>
        </van-row>
        <van-collapse v-model="activeNames">
          <van-collapse-item
            v-if="model.ownerType === 1"
            title="车主信息"
            name="1"
          >
            <van-row>
              <van-col span="8"><label>车主姓名:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.ownerName }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>车主电话:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.ownerMobile }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>证件类型:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.cardType | attr(idTypes) }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>证件号码:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.cardNumber }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>证件照片:</label></van-col>
              <van-col span="16">
                <van-image
                  height="100"
                  :src="model.cardPicture"
                  @click="handleImagePreview(model.cardPicture)"
                />
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>联系人类型:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.spareRelation }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>备用联系人:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.spareName }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>联系人电话:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.spareMobile }}
                </span>
              </van-col>
            </van-row>
          </van-collapse-item>
          <van-collapse-item v-else title="企业信息" name="1">
            <van-row>
              <van-col span="8"><label>营业执照:</label></van-col>
              <van-col span="16">
                <van-image
                  height="100"
                  :src="model.cardPicture"
                  @click="handleImagePreview(model.cardPicture)"
                />
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>企业名称:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.ownerName }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>证件号码:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.cardNumber }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>联系电话:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.ownerMobile }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>驾驶人:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.driverName }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>驾驶人电话:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.driverMobile }}
                </span>
              </van-col>
            </van-row>
          </van-collapse-item>
          <van-collapse-item title="车辆信息" name="2">
            <van-row>
              <van-col span="8"><label>购车发票/合同:</label></van-col>
              <van-col span="16">
                <van-image
                  height="100"
                  :src="model.vehicleExtend.invoice"
                  @click="handleImagePreview(model.vehicleExtend.invoice)"
                />
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>车辆合格证:</label></van-col>
              <van-col span="16">
                <van-image
                  height="100"
                  :src="model.vehicleExtend.certificate"
                  @click="handleImagePreview(model.vehicleExtend.certificate)"
                />
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>车辆类型:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.orderSourceDesc }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>车牌颜色:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.vehicleExtend.plateColor }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>车牌号码:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.vehicleExtend.plateNumber }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>车辆型号:</label></van-col>
              <van-col span="16">
                <breadcrumb
                  :data="[
                    model.vehicleExtend.factoryName,
                    model.vehicleExtend.brandName,
                    model.vehicleExtend.versionName
                  ]"
                />
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>车型配置:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.vehicleExtend.configName }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>车架号:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.vehicleExtend.vin }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>发动机号:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.vehicleExtend.engineNumber }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>厂牌型号:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.vehicleExtend.factoryNumber }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>车辆颜色:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.vehicleExtend.color }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>开票金额:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.vehicleExtend.ivoiceAmount / 10000.0 }}
                  <small>万元</small>
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>购买日期:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.vehicleExtend.buyTime | time('yyyy年MM月dd日') }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>是否按揭:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.isMortgage ? '是' : '否' }}
                </span>
              </van-col>
            </van-row>
            <div v-if="model.isMortgage">
              <van-row>
                <van-col span="8"><label>金融公司:</label></van-col>
                <van-col span="16">
                  <span>
                    {{ model.vehicleExtend.financeName }}
                  </span>
                </van-col>
              </van-row>
              <van-row>
                <van-col span="8"><label>按揭金额:</label></van-col>
                <van-col span="16">
                  <span>
                    {{ model.vehicleExtend.mortgageAmount / 10000.0 }}
                    <small>万元</small>
                  </span>
                </van-col>
              </van-row>
              <van-row>
                <van-col span="8"><label>按揭期限:</label></van-col>
                <van-col span="16">
                  <span>
                    {{ model.vehicleExtend.mortgageMonth }}
                    <small>月</small>
                  </span>
                </van-col>
              </van-row>
              <van-row>
                <van-col span="8"><label>金融备注:</label></van-col>
                <van-col span="16">
                  <span>
                    {{ model.vehicleExtend.financeRemark }}
                  </span>
                </van-col>
              </van-row>
            </div>
          </van-collapse-item>
          <van-collapse-item title="保函信息" name="3">
            <van-row>
              <van-col span="8"><label>电子保函:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.isElectronPolicy ? '是' : '否' }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>保险公司:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.electronPolicySupplierName }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>保障金额:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.insuredAmount / 10000.0 }}
                  <small class="d-unit">万元</small>
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>第一受益人:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.beneficiary }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>服务模版:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.templateName }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>保险期限:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.serviceStart | time('yyyy年MM月dd日') }}
                  <small>至</small>
                  {{ model.serviceEnd | time('yyyy年MM月dd日') }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>应收费用:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.receivableAmount }}
                  <small class="d-unit">元</small>
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>实收费用:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.paidAmount }}
                  <small class="d-unit">元</small>
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>保函显示费用:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.handlePaidAmount }}
                  <small class="d-unit">元</small>
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>支付方式:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.payType | attr(paymodes) }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>支付证明:</label></van-col>
              <van-col span="16">
                <van-image
                  height="100"
                  :src="model.payPictures"
                  @click="handleImagePreview(model.payPictures)"
                />
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>支付备注:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.payRemark }}
                </span>
              </van-col>
            </van-row>
          </van-collapse-item>
          <van-collapse-item
            v-if="model.isCreateInstall"
            title="安装信息"
            name="4"
          >
            <van-row>
              <van-col span="8"><label>安装地点:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.installExtend.addressType === 0 ? '店内' : '上门' }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>安装地址:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.installExtend.address }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>安装设备:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.tempPlateDevice }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>联系人类型:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.installExtend.contractType | attr(installContacts) }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>联系人姓名:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.installExtend.contractName }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>联系人电话:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.installExtend.contractMobile }}
                </span>
              </van-col>
            </van-row>
          </van-collapse-item>
          <van-collapse-item title="其他信息" name="5">
            <van-row>
              <van-col span="8"><label>经销商:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.shopName }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>驻店员:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.acbSaleName }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>销售员:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.shopSaleName }}
                </span>
              </van-col>
            </van-row>
            <van-row>
              <van-col span="8"><label>订单备注:</label></van-col>
              <van-col span="16">
                <span>
                  {{ model.remark || '无' }}
                </span>
              </van-col>
            </van-row>
            <van-row v-if="model.extendPicture.length > 0">
              <van-col span="8"><label>附件图片:</label></van-col>
              <van-col span="16">
                <van-image
                  height="100"
                  v-for="picture in model.extendPicture"
                  :key="picture"
                  :src="picture"
                  @click="handleImagePreview(picture)"
                />
              </van-col>
            </van-row>
          </van-collapse-item>
        </van-collapse>
        <!-- <div class="d-actions">
          <van-button
            v-if="model.isElectronPolicy && model.state == 40"
            size="small"
            type="warning"
            @click="handleDownload"
          >
            下载保单
          </van-button>
        </div> -->
      </div>
    </div>
    <van-image-preview
      v-model="showPreview"
      :images="pictures"
      :startPosition="currentIndex"
      :loop="false"
      @change="handlePreviewChange"
    >
      <template v-slot:index>{{ currentTitle }}</template>
    </van-image-preview>
  </div>
</template>
<script>
import OrderTags from '@/components/OrderTags'
import Breadcrumb from '@/components/Breadcrumb'
import { detail } from '@/services/order'
import { idTypes, paymodes, installContacts, downloadFile } from '@/utils'
import Vue from 'vue'
import {
  NavBar,
  Collapse,
  CollapseItem,
  Button,
  Row,
  Col,
  Image,
  ImagePreview
} from 'vant'
Vue.use(NavBar)
  .use(Collapse)
  .use(CollapseItem)
  .use(Button)
  .use(Row)
  .use(Col)
  .use(Image)
  .use(ImagePreview)
export default {
  name: 'OrderDetail',
  components: {
    OrderTags,
    Breadcrumb
  },
  data() {
    return {
      showPreview: false,
      currentIndex: 0,
      currentTitle: '',
      id: '',
      activeNames: ['1'],
      model: {
        installExtend: {},
        vehicleExtend: {},
        extendPicture: []
      },
      pictures: [],
      titles: ['证件照', '购车发票/合同', '车辆合格证', '支付证明', '附件图片'],
      idTypes: idTypes,
      paymodes: paymodes,
      installContacts: installContacts
    }
  },
  mounted() {
    this.id = this.$route.params.id
    detail(this.id).then(json => {
      this.model = json
      this.model.installExtend = json.installExtend || {}
      if (json.ownerType === 2) {
        this.titles[0] = '营业执照'
      }
      this.pictures.push(json.cardPicture)
      this.pictures.push(json.vehicleExtend.invoice)
      this.pictures.push(json.vehicleExtend.certificate)
      this.pictures.push(json.payPictures)
      for (var i in json.extendPicture) {
        this.pictures.push(json.extendPicture[i])
      }
    })
  },
  methods: {
    handleBack() {
      this.$router.go(-1)
    },
    handleImagePreview(src) {
      this.handlePreviewChange(this.pictures.indexOf(src) || 0)
      this.showPreview = true
    },
    handlePreviewChange(index) {
      this.currentIndex = index
      if (index >= this.titles.length - 1) {
        index = 4
      }
      this.currentTitle = this.titles[index] //+ `[${index + 1}/${this.pictures.length}]`
    },
    handleDownload() {
      downloadFile(this.model.policyFile, `icb_${this.model.policyNumber}`)
    }
  }
}
</script>
<style lang="less">
.van-image-preview__index {
  background-color: rgba(100, 100, 100, 0.66);
  padding: 0.2rem 0.6rem;
}
.van-cell-group__title {
  padding-left: 0;
}
.van-collapse-item__title {
  padding-left: 0;
  background-color: transparent;
}
.van-cell:not(:last-child)::after {
  left: 0;
}
.van-collapse-item__content {
  padding: 16px 0.5rem;
  background-color: transparent;
}
.d-container {
  margin: 46px 0;
  .d-content {
    padding: 20px;
  }
  .van-row {
    color: #333;
    font-size: 14px;
    padding: 0.45rem 0;
    label {
      color: #777;
      margin-right: 0.5rem;
    }
    small,
    .d-unit {
      color: #999;
    }
  }
  .d-actions {
    padding: 15px 0;
    text-align: right;
  }
}
</style>
