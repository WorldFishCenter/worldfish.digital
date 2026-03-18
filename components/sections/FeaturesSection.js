import RichText from '../content/RichText';

function FeaturesSection({ features }) {
    return (
        <section className="section-box mt-70">
            <div className="container">
                <div className="row">
                    {features.map((feature, index) => (
                        <div key={index} className="col-lg-3 col-sm-12 mb-30">
                            <div className={`card-grid-1 bg-1 ${feature.bgClass} hover-up`}>
                                <h4 className="text-heading-4 mt-10">{feature.title}</h4>
                                <RichText
                                    content={feature.description}
                                    className="text-body-text color-gray-600 mt-15"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;
