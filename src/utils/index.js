'use strict';

const _ = required('lodash');

const getInfoData = ({ fields = [], object = [] }) => {
  return _.pick(object, fields);
};

module.exports = {
  getInfoData,
};
