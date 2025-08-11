import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-primary-dark-green text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center text-white hover:text-yellow-200 transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            ホームに戻る
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">利用規約</h1>
          <p className="text-lg opacity-90">
            なおかん (naocan) の利用規約です。
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第1条（適用）</h2>
                <p className="text-gray-700">
                  本規約は、なおかん (naocan) が提供するサービス（以下「本サービス」）の利用条件を定めるものです。
                  お客様は、本サービスを利用することにより、本規約に同意したものとみなします。
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第2条（利用登録）</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">1. 本サービスの利用を希望する者は、本規約に同意の上、当社の定める方法によって利用登録を申請するものとします。</p>
                  <p className="text-gray-700">2. 当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあります。</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>虚偽の事項を届け出た場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>その他、当社が利用登録を相当でないと判断した場合</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第3条（禁止事項）</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">お客様は、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>法令または公序良俗に違反する行為</li>
                    <li>犯罪行為に関連する行為</li>
                    <li>当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
                    <li>本サービスの運営を妨害するおそれのある行為</li>
                    <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                    <li>他のユーザーに成りすます行為</li>
                    <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
                    <li>その他、当社が不適切と判断する行為</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第4条（商品の購入）</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">1. お客様は、本サービスを通じて商品を購入することができます。</p>
                  <p className="text-gray-700">2. 商品の購入にあたっては、当社が定める方法により、商品代金を支払うものとします。</p>
                  <p className="text-gray-700">3. 商品の所有権は、お客様が商品代金を完済した時点でお客様に移転するものとします。</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第5条（返品・交換）</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">1. 商品到着後7日以内に限り、不良品の返品・交換を承ります。</p>
                  <p className="text-gray-700">2. お客様都合による返品はお受けできません。</p>
                  <p className="text-gray-700">3. 返品・交換の送料は当社負担とします。</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第6条（免責事項）</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">1. 当社は、本サービスに関して、お客様と他のお客様または第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。</p>
                  <p className="text-gray-700">2. 当社は、本サービスの内容変更、中断、終了によって生じたいかなる損害についても、一切の責任を負いません。</p>
                  <p className="text-gray-700">3. 当社は、お客様が本サービスを使って期待される結果を取得できない場合や、不正確または不完全な情報に基づいて行動した場合について、一切の責任を負いません。</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第7条（サービス内容の変更等）</h2>
                <p className="text-gray-700">
                  当社は、お客様に通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、
                  これによってお客様に生じた損害について一切の責任を負いません。
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第8条（利用規約の変更）</h2>
                <p className="text-gray-700">
                  当社は、必要と判断した場合には、お客様に通知することなくいつでも本規約を変更することができるものとします。
                  なお、本規約変更後、本サービスの利用を継続した場合には、変更後の規約に同意したものとみなします。
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第9条（通知または連絡）</h2>
                <p className="text-gray-700">
                  お客様と当社との間の通知または連絡は、当社の定める方法によって行うものとします。
                  当社は、お客様から、当社が別途定める方法に従った変更の届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時に効力を生じるものとします。
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第10条（権利義務の譲渡の禁止）</h2>
                <p className="text-gray-700">
                  お客様は、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第11条（準拠法・裁判管轄）</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">1. 本規約の解釈にあたっては、日本法を準拠法とします。</p>
                  <p className="text-gray-700">2. 本サービスに関して紛争が生じた場合には、大阪地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">第12条（お問い合わせ）</h2>
                <div className="space-y-2">
                  <p className="text-gray-700">本規約に関するお問い合わせは、以下までご連絡ください：</p>
                  <p className="text-gray-700">なおかん (naocan)</p>
                  <p className="text-gray-700">代表: 挾間 健二</p>
                  <p className="text-gray-700">住所: 〒544-0003 大阪市生野区小路東6-7-27</p>
                  <p className="text-gray-700">電話: 090-7882-2827</p>
                  <p className="text-gray-700">メール: naokan.buddhaflower@icloud.com</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-charcoal mb-4">附則</h2>
                <p className="text-gray-700">本規約は2025年1月1日から施行します。</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
