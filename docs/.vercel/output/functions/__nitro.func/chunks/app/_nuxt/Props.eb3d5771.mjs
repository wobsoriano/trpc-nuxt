import __nuxt_component_0 from './ProseTable.3ea7dd7f.mjs';
import __nuxt_component_1 from './ProseThead.2114e7bd.mjs';
import __nuxt_component_2 from './ProseTr.44ef8373.mjs';
import __nuxt_component_3 from './ProseTh.52bbadec.mjs';
import __nuxt_component_4 from './ProseTbody.82952be8.mjs';
import __nuxt_component_5 from './ProseTd.2488f163.mjs';
import __nuxt_component_3$1 from './ProseCodeInline.b9cff2ce.mjs';
import { defineComponent, computed, useSSRContext, withCtx, createTextVNode, createVNode, openBlock, createBlock, createCommentVNode, toDisplayString, Fragment, renderList } from 'vue';
import { b as _export_sfc } from '../server.mjs';
import { u as useAsyncData } from './asyncData.cada7b2c.mjs';
import { kebabCase } from 'scule';
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import 'ohmyfetch';
import 'hookable';
import 'unctx';
import 'destr';
import 'ufo';
import 'h3';
import 'defu';
import 'vue-router';
import 'property-information';
import 'html-tags';
import '@iconify/vue/dist/offline';
import '@iconify/vue';
import 'ohash';
import 'cookie-es';
import 'pinceau/runtime';
import '../../nitro/vercel.mjs';
import 'node-fetch-native/polyfill';
import 'unenv/runtime/fetch/index';
import 'unstorage';
import 'unstorage/drivers/overlay';
import 'unstorage/drivers/memory';
import 'radix3';
import 'pathe';
import 'unified';
import 'mdast-util-to-string';
import 'micromark/lib/preprocess.js';
import 'micromark/lib/postprocess.js';
import 'unist-util-stringify-position';
import 'micromark-util-character';
import 'micromark-util-chunked';
import 'micromark-util-resolve-all';
import 'remark-emoji';
import 'rehype-slug';
import 'remark-squeeze-paragraphs';
import 'rehype-external-links';
import 'remark-gfm';
import 'rehype-sort-attribute-values';
import 'rehype-sort-attributes';
import 'rehype-raw';
import 'remark-mdc';
import 'remark-parse';
import 'remark-rehype';
import 'mdast-util-to-hast';
import 'detab';
import 'unist-builder';
import 'mdurl';
import 'slugify';
import 'unist-util-position';
import 'unist-util-visit';
import 'shiki-es';
import 'unenv/runtime/npm/consola';

const _sfc_main = defineComponent({
  props: {
    of: {
      type: String,
      default: void 0
    },
    required: {
      type: Boolean,
      default: void 0
    },
    values: {
      type: Boolean,
      default: void 0
    },
    description: {
      type: Boolean,
      default: void 0
    },
    default: {
      type: Boolean,
      default: void 0
    }
  },
  async setup(props) {
    const query = `/api/component-meta/${kebabCase(props.of)}`;
    const { data: meta } = await useAsyncData(props.of, () => $fetch(query), "$jdpANtUKvA");
    const properties = computed(() => meta.value.props.filter((prop) => {
      var _a;
      return !((_a = prop.tags) == null ? void 0 : _a.ignore.includes(prop));
    }));
    const showRequired = computed(() => {
      var _a;
      if (props.required !== void 0) {
        return props.required;
      }
      return (_a = properties.value) == null ? void 0 : _a.find((prop) => prop.required !== void 0);
    });
    const showValues = computed(() => {
      var _a;
      if (props.values !== void 0) {
        return props.values;
      }
      return (_a = properties.value) == null ? void 0 : _a.find((prop) => prop.values);
    });
    const showDescription = computed(() => {
      var _a;
      if (props.description !== void 0) {
        return props.description;
      }
      return (_a = properties.value) == null ? void 0 : _a.find((prop) => prop.description);
    });
    const showDefault = computed(() => {
      var _a;
      if (props.default !== void 0) {
        return props.default;
      }
      return (_a = properties.value) == null ? void 0 : _a.find((prop) => prop.default);
    });
    return {
      meta,
      properties,
      showRequired,
      showValues,
      showDescription,
      showDefault
    };
  }
});
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  var _a, _b, _c;
  const _component_ProseTable = __nuxt_component_0;
  const _component_ProseThead = __nuxt_component_1;
  const _component_ProseTr = __nuxt_component_2;
  const _component_ProseTh = __nuxt_component_3;
  const _component_ProseTbody = __nuxt_component_4;
  const _component_ProseTd = __nuxt_component_5;
  const _component_ProseCodeInline = __nuxt_component_3$1;
  if (_ctx.meta && ((_a = _ctx.meta) == null ? void 0 : _a.props) && ((_c = (_b = _ctx.meta) == null ? void 0 : _b.props) == null ? void 0 : _c.length)) {
    _push(ssrRenderComponent(_component_ProseTable, _attrs, {
      default: withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(ssrRenderComponent(_component_ProseThead, null, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(ssrRenderComponent(_component_ProseTr, null, {
                  default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                    if (_push4) {
                      _push4(ssrRenderComponent(_component_ProseTh, null, {
                        default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                          if (_push5) {
                            _push5(`Prop`);
                          } else {
                            return [
                              createTextVNode("Prop")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent4, _scopeId3));
                      _push4(ssrRenderComponent(_component_ProseTh, null, {
                        default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                          if (_push5) {
                            _push5(`Type`);
                          } else {
                            return [
                              createTextVNode("Type")
                            ];
                          }
                        }),
                        _: 1
                      }, _parent4, _scopeId3));
                      if (_ctx.showRequired) {
                        _push4(ssrRenderComponent(_component_ProseTh, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Required `);
                            } else {
                              return [
                                createTextVNode(" Required ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        _push4(`<!---->`);
                      }
                      if (_ctx.showDefault) {
                        _push4(ssrRenderComponent(_component_ProseTh, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Default `);
                            } else {
                              return [
                                createTextVNode(" Default ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        _push4(`<!---->`);
                      }
                      if (_ctx.showValues) {
                        _push4(ssrRenderComponent(_component_ProseTh, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Values `);
                            } else {
                              return [
                                createTextVNode(" Values ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        _push4(`<!---->`);
                      }
                      if (_ctx.showDescription) {
                        _push4(ssrRenderComponent(_component_ProseTh, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Description `);
                            } else {
                              return [
                                createTextVNode(" Description ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        _push4(`<!---->`);
                      }
                    } else {
                      return [
                        createVNode(_component_ProseTh, null, {
                          default: withCtx(() => [
                            createTextVNode("Prop")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_ProseTh, null, {
                          default: withCtx(() => [
                            createTextVNode("Type")
                          ]),
                          _: 1
                        }),
                        _ctx.showRequired ? (openBlock(), createBlock(_component_ProseTh, { key: 0 }, {
                          default: withCtx(() => [
                            createTextVNode(" Required ")
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        _ctx.showDefault ? (openBlock(), createBlock(_component_ProseTh, { key: 1 }, {
                          default: withCtx(() => [
                            createTextVNode(" Default ")
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        _ctx.showValues ? (openBlock(), createBlock(_component_ProseTh, { key: 2 }, {
                          default: withCtx(() => [
                            createTextVNode(" Values ")
                          ]),
                          _: 1
                        })) : createCommentVNode("", true),
                        _ctx.showDescription ? (openBlock(), createBlock(_component_ProseTh, { key: 3 }, {
                          default: withCtx(() => [
                            createTextVNode(" Description ")
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 1
                }, _parent3, _scopeId2));
              } else {
                return [
                  createVNode(_component_ProseTr, null, {
                    default: withCtx(() => [
                      createVNode(_component_ProseTh, null, {
                        default: withCtx(() => [
                          createTextVNode("Prop")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_ProseTh, null, {
                        default: withCtx(() => [
                          createTextVNode("Type")
                        ]),
                        _: 1
                      }),
                      _ctx.showRequired ? (openBlock(), createBlock(_component_ProseTh, { key: 0 }, {
                        default: withCtx(() => [
                          createTextVNode(" Required ")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      _ctx.showDefault ? (openBlock(), createBlock(_component_ProseTh, { key: 1 }, {
                        default: withCtx(() => [
                          createTextVNode(" Default ")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      _ctx.showValues ? (openBlock(), createBlock(_component_ProseTh, { key: 2 }, {
                        default: withCtx(() => [
                          createTextVNode(" Values ")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true),
                      _ctx.showDescription ? (openBlock(), createBlock(_component_ProseTh, { key: 3 }, {
                        default: withCtx(() => [
                          createTextVNode(" Description ")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ];
              }
            }),
            _: 1
          }, _parent2, _scopeId));
          _push2(ssrRenderComponent(_component_ProseTbody, null, {
            default: withCtx((_2, _push3, _parent3, _scopeId2) => {
              if (_push3) {
                _push3(`<!--[-->`);
                ssrRenderList(_ctx.properties, (prop) => {
                  _push3(ssrRenderComponent(_component_ProseTr, {
                    key: prop.name
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_ProseTd, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_ProseCodeInline, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate((prop == null ? void 0 : prop.name) || "?")}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString((prop == null ? void 0 : prop.name) || "?"), 1)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_ProseCodeInline, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString((prop == null ? void 0 : prop.name) || "?"), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_ProseTd, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_ProseCodeInline, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`${ssrInterpolate((prop == null ? void 0 : prop.type) || "?")}`);
                                  } else {
                                    return [
                                      createTextVNode(toDisplayString((prop == null ? void 0 : prop.type) || "?"), 1)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_ProseCodeInline, null, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString((prop == null ? void 0 : prop.type) || "?"), 1)
                                  ]),
                                  _: 2
                                }, 1024)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                        if (_ctx.showRequired) {
                          _push4(ssrRenderComponent(_component_ProseTd, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_ProseCodeInline, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(prop.required === "?" ? "?" : prop.required ? "Yes" : "No")}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(prop.required === "?" ? "?" : prop.required ? "Yes" : "No"), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_ProseCodeInline, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(prop.required === "?" ? "?" : prop.required ? "Yes" : "No"), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (_ctx.showDefault) {
                          _push4(ssrRenderComponent(_component_ProseTd, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (prop.default) {
                                  _push5(ssrRenderComponent(_component_ProseCodeInline, null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate((prop == null ? void 0 : prop.default) || "?")}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString((prop == null ? void 0 : prop.default) || "?"), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<!---->`);
                                }
                              } else {
                                return [
                                  prop.default ? (openBlock(), createBlock(_component_ProseCodeInline, { key: 0 }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString((prop == null ? void 0 : prop.default) || "?"), 1)
                                    ]),
                                    _: 2
                                  }, 1024)) : createCommentVNode("", true)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (_ctx.showValues) {
                          _push4(ssrRenderComponent(_component_ProseTd, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                if (prop.values) {
                                  _push5(ssrRenderComponent(_component_ProseCodeInline, null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate((prop == null ? void 0 : prop.values) || "?")}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString((prop == null ? void 0 : prop.values) || "?"), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(ssrRenderComponent(_component_ProseCodeInline, null, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(` - `);
                                      } else {
                                        return [
                                          createTextVNode(" - ")
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                }
                              } else {
                                return [
                                  prop.values ? (openBlock(), createBlock(_component_ProseCodeInline, { key: 0 }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString((prop == null ? void 0 : prop.values) || "?"), 1)
                                    ]),
                                    _: 2
                                  }, 1024)) : (openBlock(), createBlock(_component_ProseCodeInline, { key: 1 }, {
                                    default: withCtx(() => [
                                      createTextVNode(" - ")
                                    ]),
                                    _: 1
                                  }))
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        if (_ctx.showDescription) {
                          _push4(ssrRenderComponent(_component_ProseTd, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_ProseCodeInline, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(prop.description)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(prop.description), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(_component_ProseCodeInline, null, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(prop.description), 1)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode(_component_ProseTd, null, {
                            default: withCtx(() => [
                              createVNode(_component_ProseCodeInline, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString((prop == null ? void 0 : prop.name) || "?"), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(_component_ProseTd, null, {
                            default: withCtx(() => [
                              createVNode(_component_ProseCodeInline, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString((prop == null ? void 0 : prop.type) || "?"), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024),
                          _ctx.showRequired ? (openBlock(), createBlock(_component_ProseTd, { key: 0 }, {
                            default: withCtx(() => [
                              createVNode(_component_ProseCodeInline, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(prop.required === "?" ? "?" : prop.required ? "Yes" : "No"), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)) : createCommentVNode("", true),
                          _ctx.showDefault ? (openBlock(), createBlock(_component_ProseTd, { key: 1 }, {
                            default: withCtx(() => [
                              prop.default ? (openBlock(), createBlock(_component_ProseCodeInline, { key: 0 }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString((prop == null ? void 0 : prop.default) || "?"), 1)
                                ]),
                                _: 2
                              }, 1024)) : createCommentVNode("", true)
                            ]),
                            _: 2
                          }, 1024)) : createCommentVNode("", true),
                          _ctx.showValues ? (openBlock(), createBlock(_component_ProseTd, { key: 2 }, {
                            default: withCtx(() => [
                              prop.values ? (openBlock(), createBlock(_component_ProseCodeInline, { key: 0 }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString((prop == null ? void 0 : prop.values) || "?"), 1)
                                ]),
                                _: 2
                              }, 1024)) : (openBlock(), createBlock(_component_ProseCodeInline, { key: 1 }, {
                                default: withCtx(() => [
                                  createTextVNode(" - ")
                                ]),
                                _: 1
                              }))
                            ]),
                            _: 2
                          }, 1024)) : createCommentVNode("", true),
                          _ctx.showDescription ? (openBlock(), createBlock(_component_ProseTd, { key: 3 }, {
                            default: withCtx(() => [
                              createVNode(_component_ProseCodeInline, null, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(prop.description), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                });
                _push3(`<!--]-->`);
              } else {
                return [
                  (openBlock(true), createBlock(Fragment, null, renderList(_ctx.properties, (prop) => {
                    return openBlock(), createBlock(_component_ProseTr, {
                      key: prop.name
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_ProseTd, null, {
                          default: withCtx(() => [
                            createVNode(_component_ProseCodeInline, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString((prop == null ? void 0 : prop.name) || "?"), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(_component_ProseTd, null, {
                          default: withCtx(() => [
                            createVNode(_component_ProseCodeInline, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString((prop == null ? void 0 : prop.type) || "?"), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024),
                        _ctx.showRequired ? (openBlock(), createBlock(_component_ProseTd, { key: 0 }, {
                          default: withCtx(() => [
                            createVNode(_component_ProseCodeInline, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(prop.required === "?" ? "?" : prop.required ? "Yes" : "No"), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024)) : createCommentVNode("", true),
                        _ctx.showDefault ? (openBlock(), createBlock(_component_ProseTd, { key: 1 }, {
                          default: withCtx(() => [
                            prop.default ? (openBlock(), createBlock(_component_ProseCodeInline, { key: 0 }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString((prop == null ? void 0 : prop.default) || "?"), 1)
                              ]),
                              _: 2
                            }, 1024)) : createCommentVNode("", true)
                          ]),
                          _: 2
                        }, 1024)) : createCommentVNode("", true),
                        _ctx.showValues ? (openBlock(), createBlock(_component_ProseTd, { key: 2 }, {
                          default: withCtx(() => [
                            prop.values ? (openBlock(), createBlock(_component_ProseCodeInline, { key: 0 }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString((prop == null ? void 0 : prop.values) || "?"), 1)
                              ]),
                              _: 2
                            }, 1024)) : (openBlock(), createBlock(_component_ProseCodeInline, { key: 1 }, {
                              default: withCtx(() => [
                                createTextVNode(" - ")
                              ]),
                              _: 1
                            }))
                          ]),
                          _: 2
                        }, 1024)) : createCommentVNode("", true),
                        _ctx.showDescription ? (openBlock(), createBlock(_component_ProseTd, { key: 3 }, {
                          default: withCtx(() => [
                            createVNode(_component_ProseCodeInline, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(prop.description), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          _: 2
                        }, 1024)) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ];
              }
            }),
            _: 1
          }, _parent2, _scopeId));
        } else {
          return [
            createVNode(_component_ProseThead, null, {
              default: withCtx(() => [
                createVNode(_component_ProseTr, null, {
                  default: withCtx(() => [
                    createVNode(_component_ProseTh, null, {
                      default: withCtx(() => [
                        createTextVNode("Prop")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_ProseTh, null, {
                      default: withCtx(() => [
                        createTextVNode("Type")
                      ]),
                      _: 1
                    }),
                    _ctx.showRequired ? (openBlock(), createBlock(_component_ProseTh, { key: 0 }, {
                      default: withCtx(() => [
                        createTextVNode(" Required ")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    _ctx.showDefault ? (openBlock(), createBlock(_component_ProseTh, { key: 1 }, {
                      default: withCtx(() => [
                        createTextVNode(" Default ")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    _ctx.showValues ? (openBlock(), createBlock(_component_ProseTh, { key: 2 }, {
                      default: withCtx(() => [
                        createTextVNode(" Values ")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    _ctx.showDescription ? (openBlock(), createBlock(_component_ProseTh, { key: 3 }, {
                      default: withCtx(() => [
                        createTextVNode(" Description ")
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }),
            createVNode(_component_ProseTbody, null, {
              default: withCtx(() => [
                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.properties, (prop) => {
                  return openBlock(), createBlock(_component_ProseTr, {
                    key: prop.name
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_ProseTd, null, {
                        default: withCtx(() => [
                          createVNode(_component_ProseCodeInline, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString((prop == null ? void 0 : prop.name) || "?"), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(_component_ProseTd, null, {
                        default: withCtx(() => [
                          createVNode(_component_ProseCodeInline, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString((prop == null ? void 0 : prop.type) || "?"), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      _ctx.showRequired ? (openBlock(), createBlock(_component_ProseTd, { key: 0 }, {
                        default: withCtx(() => [
                          createVNode(_component_ProseCodeInline, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(prop.required === "?" ? "?" : prop.required ? "Yes" : "No"), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024)) : createCommentVNode("", true),
                      _ctx.showDefault ? (openBlock(), createBlock(_component_ProseTd, { key: 1 }, {
                        default: withCtx(() => [
                          prop.default ? (openBlock(), createBlock(_component_ProseCodeInline, { key: 0 }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString((prop == null ? void 0 : prop.default) || "?"), 1)
                            ]),
                            _: 2
                          }, 1024)) : createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1024)) : createCommentVNode("", true),
                      _ctx.showValues ? (openBlock(), createBlock(_component_ProseTd, { key: 2 }, {
                        default: withCtx(() => [
                          prop.values ? (openBlock(), createBlock(_component_ProseCodeInline, { key: 0 }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString((prop == null ? void 0 : prop.values) || "?"), 1)
                            ]),
                            _: 2
                          }, 1024)) : (openBlock(), createBlock(_component_ProseCodeInline, { key: 1 }, {
                            default: withCtx(() => [
                              createTextVNode(" - ")
                            ]),
                            _: 1
                          }))
                        ]),
                        _: 2
                      }, 1024)) : createCommentVNode("", true),
                      _ctx.showDescription ? (openBlock(), createBlock(_component_ProseTd, { key: 3 }, {
                        default: withCtx(() => [
                          createVNode(_component_ProseCodeInline, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(prop.description), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024)) : createCommentVNode("", true)
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ]),
              _: 1
            })
          ];
        }
      }),
      _: 1
    }, _parent));
  } else {
    _push(`<!---->`);
  }
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/.pnpm/@nuxt-themes+docus-edge@0.1.0-2a7c428_nuxt@3.0.0-rc.12/node_modules/@nuxt-themes/docus-edge/components/content/Props.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Props = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { Props as default };
//# sourceMappingURL=Props.eb3d5771.mjs.map
