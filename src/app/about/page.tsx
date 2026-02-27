export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">关于 Peace Net</h1>

      <div className="prose prose-neutral max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          Peace Net 是一个致力于传递和平之声的平台，关注乌克兰局势，
          汇集来自世界各地的真实故事与声音。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">我们的使命</h2>
        <p className="text-muted-foreground mb-6">
          我们相信每一个声音都值得被听见。通过分享真实的故事和新闻，
          我们希望促进理解、同理心和和平。
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">联系我们</h2>
        <p className="text-muted-foreground">
          如有任何问题或建议，欢迎通过邮件联系我们。
        </p>
      </div>
    </div>
  )
}
