import { defineStore } from 'pinia'
import { orreryStore } from './orreryStore.js'
import { lifestrapStore } from './lifestrapStore.js'
import { aiInterfaceStore } from './aiInterface.js'
import { besearchStore } from './besearchStore.js'

export const loomStore = defineStore('loomstore', {
  state: () => ({
    // Tapestry of dynamic relationships
    alignments: new Map(), // strapKey -> Map of associated contracts
    storyContext: {},
    activeLoomID: null,
    // The active projection slots of the Lens
    activeLens: {
      capacity: new Map(), // Active biological nodes (e.g., heart, blood-glucose)
      context: new Map(),   // Active environmental nodes (e.g., building, solar-elevation)
      attunement: [],
      residue: []          // Unmapped fragments
    },
    lifestrapTexture: {
      pillars: {
        capacity: [],
        context: [],
        attunement: [],
        heli: [],
        coherence: { isStable: false, resonance: 0 },
      },
      residue: [],
      key: "",
    },
    digestInput: null,
    loomCache: {},
  }),
  getters: {
    capacityItems: (state) => Array.from(state.activeLens.capacity.values()),
    contextItems: (state) => Array.from(state.activeLens.context.values()),
    unmappedFragments: (state) => state.activeLens.residue,
    attunementItems: (state) => state.activeLens.attunement
  },
  actions: {
    // The Loom processes the active story stream and maps it to the Lens
    animateStrand(cueKey, rawDataInstanceId) {
      const orrery = orreryStore()
      const lifestrap = lifestrapStore()
      
      const referenceCue = orrery.registry.get(cueKey)
      // Assuming activeStreams or similar Map exists in lifestrapStore
      const rawStream = lifestrap.activeStreams?.get(rawDataInstanceId)
      
      const activeStrand = {
        definition: referenceCue,
        telemetry: rawStream,
        label: referenceCue?.label || cueKey,
        value: cueKey,
        pulsedAt: new Date() // Bound to Heli clock cycle
      }
      
      // Sort into the active Lens projection based on the reference domain
      if (referenceCue?.domain === 'capacity') {
        this.activeLens.capacity.set(cueKey, activeStrand)
      } else if (referenceCue?.domain?.startsWith('context')) {
        this.activeLens.context.set(cueKey, activeStrand)
      }
    },

    updateActiveLensFromTexture(texture) {
      if (!texture || !texture.pillars) return;

      this.activeLens.residue = texture.residue || [];
      this.activeLens.attunement = texture.pillars.attunement || [];
      this.activeLens.capacity.clear();
      this.activeLens.context.clear();

      // Map Capacity
      if (texture.pillars.capacity) {
        texture.pillars.capacity.forEach((item) => {
          if (item.value) {
            this.activeLens.capacity.set(item.value, item);
            this.animateStrand(item.value, item.instanceId || item.value);
          }
        });
      }

      // Map Context
      if (texture.pillars.context) {
        texture.pillars.context.forEach((item) => {
          if (item.value) {
            this.activeLens.context.set(item.value, item);
            this.animateStrand(item.value, item.instanceId || item.value);
          }
        });
      }
    },
    weavePattern(lsContract) {
      console.log("weave pattern");
      console.log(lsContract);
      const lifestrap = lifestrapStore();
      const ai = aiInterfaceStore();
      const besearch = besearchStore();

      // Use Utility to extract the texture correctly from the contract (including slots)
      const newTexture = ai.liveLsUtil.lensTobe(lsContract.key, lsContract);

      // 1. Update Global Textures
      this.lifestrapTexture = newTexture;
      this.digestInput = newTexture;
      lifestrap.setLens(newTexture);
      besearch.activeBesearchContext.story = newTexture.story;

      // Update Loom Active Lens using the consolidated helper
      this.updateActiveLensFromTexture(newTexture);

      // 3. Orchestrate Experience
      ai.initOrchestrator();
      const wasZenAction = ai.currentMode === "zen" || ai.isInitialState;
      ai.activeLifeStrapID = lsContract.key || "active-strap";
      ai.activeLifestrapKey = lsContract.key || "active-strap";
      lifestrap.activeStrapKey = lsContract.key || "active-strap";

      if (ai.experienceOrchestrator) {
        ai.experienceOrchestrator.orchestrateLifestrapReturn(
          newTexture,
          ai.newLifestrap || (lsContract.key === 'prime-life-strap') || (lsContract.key === 'new-ls'),
          wasZenAction,
        );
      }

      ai.isInitialState = false;
      ai.newLifestrap = false;
    },

    processReply(received) {
      if (received.action === "bringtobe-start") {
        // Supporting contracts and associations go here
        // We will need a way to link them to the active lifestrap story
        console.log("LoomStore: processing supporting contracts for lifestrap");
        
        // When supporting contracts arrive, it often means a new lifestrap was successfully created
        // Refresh the library to ensure the new strap appears in the list
        const library = libraryStore();
        library.sendMessage('get-library');
      } else if (received.action === "npl-reply") {
        if (received.task === "lens-extraction") {
          const ai = aiInterfaceStore();
          console.log("Lens Extraction Received:", received.data.lens);

          // Use reactive assignment for nested properties
          if (!this.lifestrapTexture || !this.lifestrapTexture.pillars) {
            this.lifestrapTexture = {
              pillars: {
                capacity: [],
                context: [],
                attunement: [],
                heli: [],
                coherence: { isStable: false, resonance: 0 },
              },
              residue: [],
              key: "",
              story: ai.storeBesearch?.activeBesearchContext?.story || "",
            };
          }

          // Force structure if partially missing
          if (!this.lifestrapTexture.pillars) {
            this.lifestrapTexture.pillars = {
              capacity: [],
              context: [],
              attunement: [],
              heli: [],
              coherence: { isStable: false, resonance: 0 },
            };
          }

          // Use "Extracted" as the default label to ensure it passes through the UI filters
          const capacity = [];
          if (received.data.lens.capacity) {
            capacity.push({
              label: "Extracted",
              value: received.data.lens.capacity,
            });
          }

          const context = [];
          if (received.data.lens.context) {
            const contextData = received.data.lens.context;
            const splitContext = Array.isArray(contextData)
              ? contextData
              : typeof contextData === "string"
                ? contextData.split(",")
                : [];

            splitContext.forEach((v) => {
              context.push({
                label: "Extracted",
                value: v.trim(),
              });
            });
          }

          // Ensure story is preserved and assigned correctly to trigger reactivity
          if (ai.storeBesearch?.activeBesearchContext?.story) {
            this.lifestrapTexture.story = ai.storeBesearch.activeBesearchContext.story;
          }

          // Deep Reactive Update with FRESH OBJECTS
          // Re-assign the WHOLE object and its nested structures to ensure all components update
          this.lifestrapTexture = {
            ...this.lifestrapTexture,
            pillars: {
              ...this.lifestrapTexture.pillars,
              capacity: [...capacity],
              context: [...context],
            },
            residue: [
              ...(received.data.lens.residue ||
                this.lifestrapTexture.residue ||
                []),
            ],
          };

          // Update Active Lens for components using the getters
          this.updateActiveLensFromTexture(this.lifestrapTexture);

          // IMPORTANT: Update activeBesearchContext to sync with the HUD and other components
          if (capacity.length > 0) {
            ai.storeBesearch.activeBesearchContext.capacity = capacity[0].value;
          }
          if (context.length > 0) {
            ai.storeBesearch.activeBesearchContext.context = context[0].value;
          }

          // Only update global IDs if the extracted key matches or if we're in a temporary state
          if (this.lifestrapTexture.key && this.lifestrapTexture.key !== 'active-strap') {
            ai.activeLifeStrapID = this.lifestrapTexture.key;
            ai.activeLifestrapKey = this.lifestrapTexture.key;
            lifestrap.activeStrapKey = this.lifestrapTexture.key;
          }

          console.log(
            "Deep Reactive Update Complete:",
            this.lifestrapTexture.pillars,
          );

          // Sync legacy digestInput with a fresh copy
          this.digestInput = JSON.parse(JSON.stringify(this.lifestrapTexture));

          // Ensure panels are open for new extraction
          if (ai.newLifestrap) {
            ai.initOrchestrator();
            ai.experienceOrchestrator.openLens();
            ai.newLifestrap = false;
          }
        }
      } else if (received.action === "ls-whole") {
        const ai = aiInterfaceStore();
        const lifestrap = lifestrapStore();
        let lifestrapPattern = received.data;
        console.log('loomStore: ls-whole received data', JSON.stringify(lifestrapPattern, null, 2))
        // lifestrap
        let lsSet = {};
        if (lifestrapPattern.lifestrap) {
          console.log('loomStore: processing straps list', lifestrapPattern.lifestrap.length)
          // Clear current straps to avoid duplicates or stale data when receiving whole list
          lifestrap.straps = [];
          
          // what full loom lifestrap is return (one only, then on demand of selction)
          let wholeLoomKey = { key: null };
          if (lifestrapPattern.whole?.lsKeytrack?.lsid) {
             wholeLoomKey = lifestrap.utilLibrary.convertBinaryToHex({
              key: lifestrapPattern.whole.lsKeytrack.lsid,
              value: {},
            });
          }
          
          // convert index to hex and add to lifestrap list
          for (let inStrap of lifestrapPattern.lifestrap) {
            const hexContract = lifestrap.utilLibrary.convertBinaryToHex(inStrap);
            lifestrap.addStrap(hexContract);
            // bring to be first lifestrap fully
            if (hexContract.key === wholeLoomKey.key) {
              ai.activeLifestrapKey = hexContract.key;
              // full context for a lifestrap story, lens, besearch(cycles, strands, braids), cues, ref contracts, orgo, gelle, resonAgent, tiny devices
              lsSet = ai.liveLsUtil.lifestrapTobe(
                hexContract.key,
                lifestrapPattern.whole,
              );
              // Cache the loom data
              this.loomCache[hexContract.key] = lsSet;
              // lens
              this.lifestrapTexture = lsSet.lens;
              this.updateActiveLensFromTexture(lsSet.lens);
              ai.storeBesearch.activeBesearchContext.story = lsSet.lens.story;
              // Legacy compatibility for components using digestInput
              this.digestInput = lsSet.lens;

              ai.activeLifeStrapID = hexContract.key;
              ai.activeLifestrapKey = hexContract.key;
              lifestrap.activeStrapKey = hexContract.key;

              // Orchestrate the experience based on whether this is a "new" story or peer return
              ai.initOrchestrator();
              const wasZen = ai.currentMode === "zen" || ai.isInitialState;

              ai.experienceOrchestrator.orchestrateLifestrapReturn(
                lsSet,
                ai.newLifestrap || (hexContract.key === 'prime-life-strap'),
                wasZen,
              );

              ai.isInitialState = false;

              // Reset newLifestrap flag after orchestration
              ai.newLifestrap = false;

              // setup peer experience
              ai.initializeSovereignSession(hexContract.key);
              
              // Ensure we ask for the library to refresh the lifestrap list
              const library = libraryStore();
              library.sendMessage('get-library');
            }
          }
        }
      } else if (received.action === "ls-whole-loom") {
        const ai = aiInterfaceStore();
        const lifestrap = lifestrapStore();
        let lsSet = ai.liveLsUtil.lensTobe("", received.data.whole.lens[0]);
        this.lifestrapTexture = lsSet;
        lifestrap.setLens(lsSet);
        this.digestInput = lsSet;
      } else if (received.action === "ls-pattern") {
        const loom = loomStore();
        console.log("ls patterm back");
        console.log(received.data);
        loom.weavePattern(received.data.index);
      }
    },
    associateContract(strapKey, contract) {
      if (!this.alignments.has(strapKey)) {
        this.alignments.set(strapKey, new Map())
      }
      const strapAlignments = this.alignments.get(strapKey)
      strapAlignments.set(contract.key, contract)
    },
    reorderStrandCues(zone, oldIndex, newIndex) {
      const ai = aiInterfaceStore();
      if (!this.lifestrapTexture?.pillars?.[zone]) return;

      const pillar = this.lifestrapTexture.pillars[zone];
      const item = pillar.splice(oldIndex, 1)[0];
      pillar.splice(newIndex, 0, item);

      console.log(`Reordered ${zone} pillar:`, pillar);

      // Sync with backend
      this.syncAttunement(item.value, zone, item.label);
    },
    updateResonWeight(word, zone, label = null) {
      if (!this.lifestrapTexture) {
        this.lifestrapTexture = {
          pillars: {
            capacity: [],
            context: [],
            heli: [],
            coherence: { isStable: false, resonance: 0 },
          },
          residue: [],
          key: "",
        };
      }

      // 1. Remove from all existing locations (residue and all pillars)
      this.lifestrapTexture.residue = this.lifestrapTexture.residue.filter(
        (w) => w !== word,
      );
      this.lifestrapTexture.pillars.capacity =
        this.lifestrapTexture.pillars.capacity.filter((i) => i.value !== word);
      this.lifestrapTexture.pillars.context =
        this.lifestrapTexture.pillars.context.filter((i) => i.value !== word);
      this.lifestrapTexture.pillars.attunement =
        this.lifestrapTexture.pillars.attunement.filter(
          (i) => i.value !== word,
        );
      this.lifestrapTexture.pillars.heli =
        this.lifestrapTexture.pillars.heli.filter((i) => i.value !== word);

      // If zone is residue, we just put it back there and exit
      if (zone === "residue") {
        if (!this.lifestrapTexture.residue.includes(word)) {
          this.lifestrapTexture.residue.push(word);
        }
        this.syncAttunement(word, zone, label);
        return;
      }

      const entry = { label: label || zone, value: word };

      if (zone === "capacity") {
        this.lifestrapTexture.pillars.capacity.push(entry);
      } else if (
        zone === "context" ||
        ["peer", "environment", "earth"].includes(zone)
      ) {
        const contextLabel =
          label ||
          (zone === "peer"
            ? "Activity"
            : zone === "environment"
              ? "Space"
              : "Temporal");
        this.lifestrapTexture.pillars.context.push({
          label: contextLabel,
          value: word,
        });
      } else if (["orbits", "days", "arcs", "heli"].includes(zone)) {
        const heliLabel =
          label ||
          (zone === "orbits"
            ? "Orbit Target"
            : zone === "days"
              ? "Rhythm"
              : "Performance");
        const heliEntry = { label: heliLabel, value: word };
        if (zone === "orbits") {
          heliEntry.math = `${word} - currentHeliAge`;
        }
        this.lifestrapTexture.pillars.heli.push(heliEntry);
      } else if (zone === "coherence" || zone === "attunement") {
        this.lifestrapTexture.pillars.attunement.push(entry);
      }

      this.syncAttunement(word, zone, label);
    },
    syncAttunement(word, zone, label) {
      const ai = aiInterfaceStore();
      // 2. Persist to backend/socket
      const message = {
        type: "bbai",
        action: "attunement-mapping",
        data: {
          word,
          zone,
          label,
          lifeStrapID: ai.activeLifeStrapID,
          contract_key: ai.activeContractKey,
        },
      };
      ai.sendMessageHOP(message);

      // 3. Trigger BeeBee feedback
      ai.storeChat.handleIncomingMessage({
        type: "agent-reply",
        role: "agent",
        content: `Mapping ${word} to ${zone}. Emulation updating...`,
        data: { text: `Mapping ${word} to ${zone}. Emulation updating...` },
        context: "extraction",
        conversationId: ai.chatAttention,
        status: "complete",
      });
    },
    fetchWholeLoom(lsKey) {
      const ai = aiInterfaceStore();
      // Clear existing lens/texture data to prepare for new data
      this.lifestrapTexture = {
        pillars: {
          capacity: [],
          context: [],
          attunement: [],
          heli: [],
          coherence: { isStable: false, resonance: 0 },
        },
        residue: [],
        key: "",
      };
      this.digestInput = null;

      const message = {
        type: "bbai",
        action: "fetch-whole-loom",
        data: {
          lifeStrapID: lsKey,
          contract_key: lsKey,
        },
      };
      ai.sendMessageHOP(message);
    },
  }
})
