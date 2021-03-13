import { queryZones } from "@/api/zones";
import { omit, cloneDeep } from "lodash";

const state = {
  zones: [],

  areaZones: [],

  policeZones: [],
};

const getters = {
  zones: (state) => state.zones,
  areaZones: (state) => state.areaZones,
  policeZones: (state) => state.policeZones,
};

const mutations = {
  setZones(state, zonesTree) {
    state.zones = zonesTree;
  },

  setAreaZones(state, areaZones) {
    state.areaZones = areaZones;
  },

  setPoliceZones(state, policeZones) {
    state.policeZones = policeZones;
  },
};

const actions = {
  async _initZones({ state, commit }, force = false) {
    if (!force && state.zones.length) return;

    const zones = await queryZones();

    const { data } = zones;

    if (data) {
      omitNullChild(data, "child");

      commit("setZones", data);

      commit("setAreaZones", splitLevelToLevel(data, 0, 1));

      commit("setPoliceZones", splitLeaveNode(data));
    }
  },

  async modifyZones({ state, commit }) {},
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

function omitNullChild(root, key) {
  const _omit = (node) => {
    for (let i = 0; i < node.length; i++) {
      if (node[i].child && !node[i].child.length) {
        node[i] = omit(node[i], key);

        return;
      }
      _omit(node[i].child);
    }
  };

  return _omit(root);
}

function splitLevelToLevel(root, startLevel, endLevel) {
  const newRoot = [];

  const _splitHead = (nodes, deep = 0) => {
    for (const item of nodes) {
      if (item.child && item.child.length) {
        if (deep === startLevel) {
          return newRoot.push(cloneDeep(item));
        }

        _splitHead(item.child, deep + 1);
      }
    }
  };

  const _splitFooter = (nodes, deep = 0) => {
    for (let index = 0; index < nodes.length; index++) {
      const item = nodes[index];

      if (item.child && item.child.length) {
        if (deep >= endLevel) {
          nodes[index] = omit(nodes[index], "child");
        }

        _splitFooter(item.child, deep + 1);
      }
    }
  };

  _splitHead(root);

  _splitFooter(newRoot, startLevel);

  return newRoot;
}

function splitLeaveNode(root) {
  const newRoot = [];

  const _split = (nodes) => {
    nodes?.forEach((item) => {
      if (!item.child) {
        newRoot.push(cloneDeep(item));
      }

      _split(item.child);
    });
  };

  _split(root);

  return newRoot;
}
