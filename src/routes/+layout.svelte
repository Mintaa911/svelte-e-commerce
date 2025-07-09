<script>
  let { children } = $props();
  import "../app.css";
  import Navbar from "../lib/components/navbar.svelte";
  import Footer from "../lib/components/footer.svelte";
</script>

<Navbar />
{@render children()}
<Footer />
