import gql from 'graphql-tag';

const RULES_QUERY = gql`query Rules{
  rules{
    id
    port
    station
    type
    attribute
    comparison
    value
    inclusive
    enabled
  }
}`;

const ADD_RULE_MUTATION = gql`mutation ($rule: RuleInput!) {
  createRule(rule: $rule) {
    id
    port
    station
    type
    attribute
    comparison
    value
    inclusive
    enabled
  }
}`;

const SET_STATE_RULE_MUTATION = gql`mutation ($ruleid: Int!, $state: Boolean!) {
  setRuleState(ruleId: $ruleid, state: $state) {
    id
    port
    station
    type
    attribute
    comparison
    value
    inclusive
    enabled
  }
}`;

const DELETE_RULE_MUTATION = gql`mutation ($ruleid: Int!) {
  deleteRule(ruleId: $ruleid) {
    id
    port
    station
    type
    attribute
    comparison
    value
    inclusive
    enabled
  }
}`;

export {
  RULES_QUERY,
  ADD_RULE_MUTATION,
  DELETE_RULE_MUTATION,
  SET_STATE_RULE_MUTATION,
};

export default {
  RULES_QUERY,
  ADD_RULE_MUTATION,
  DELETE_RULE_MUTATION,
  SET_STATE_RULE_MUTATION,
};
