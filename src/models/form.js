import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { fakeSubmitForm } from '../services/api';

export default {
  namespace: 'form',

  state: {
    step: {
      orderNumber: '',
      orderName: '',
      customer: '',
      address: '',
      deliverTime:'',
      remark:''
    },
  },

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/order/new/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
  },
};
