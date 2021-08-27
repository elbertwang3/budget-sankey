<script>
  import { LayerCake, Svg } from "layercake";
  import data from "./data/data";
  import Sankey from "./Sankey.svelte";
  import Tooltip from "./Tooltip.svelte";

  // console.log(data);

  let hoveredNode, hoveredLink;
</script>

<main>
  <div class="chart-container">
    <LayerCake {data} padding={{ top: 30, right: 0, bottom: 0, left: 0 }}>
      <Svg>
        <defs>
          <linearGradient id="rToF" x1="0" y1="0" x2="100%" y2="0"
            ><stop offset="0%" stop-color="#25C2E4" /><stop
              offset="100%"
              stop-color="#FFCA42"
            /></linearGradient
          >
          <linearGradient id="fToS" x1="0" y1="0" x2="100%" y2="0"
            ><stop offset="0%" stop-color="#FFCA42" /><stop
              offset="100%"
              stop-color="#F15F27"
            /></linearGradient
          >
        </defs>
        <Sankey bind:hoveredNode bind:hoveredLink />
      </Svg>
      <Tooltip {hoveredNode} {hoveredLink} />
    </LayerCake>
  </div>
</main>


<style>

  main {
    width: 100%;
    height: 100%;
  }

  .chart-container {
    width: 100%;
    height: 100%;
    /* height: 500px; */
  }
</style>
