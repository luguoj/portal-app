({
    template: `
      <h1>This is sample-page-1 no:{{ pageNo }}</h1>
      <el-icon class="icon pi pi-book"></el-icon>
    `,
    name: "SamplePage",
    props: {
        pageNo: String
    }
})