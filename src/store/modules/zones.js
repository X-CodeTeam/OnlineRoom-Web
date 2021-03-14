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
      commit("setZones", omitNullChild(data, "child"));

      commit(
        "setAreaZones",
        omitNullChild(splitLevelToLevel(data, 0, 1), "child")
      );

      commit(
        "setPoliceZones",
        omitNullChild(splitLevelToLevel(data, 2, 3), "child")
      );
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

export function omitNullChild(root, key) {
  const _omit = (node) => {
    if (!node) return;

    for (let i = 0; i < node.length; i++) {
      if (node[i].child && !node[i].child.length) {
        node[i] = omit(node[i], key);

        return;
      }
      _omit(node[i].child);
    }
  };

  _omit(root);

  return root;
}

export function splitLevelToLevel(root, startLevel, endLevel) {
  const newRoot = [];

  const _splitHead = (nodes, deep = 0) => {
    for (const item of nodes) {
      if (deep < startLevel && item.child && item.child.length) {
        _splitHead(item.child, deep + 1);
      }

      if (deep === startLevel) {
        newRoot.push(cloneDeep(item));
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

export function splitLeaveNode(root) {
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
