import RichText from '../content/RichText';

function AboutSection({ data }) {
    const { title, subtitle, image, features } = data;

    return (
        <section className="section-box">
            <div className="container mt-100">
                <div className="row">
                    <div className="col-lg-6 col-sm-12 block-img-we-do">
                        <img
                            className="bdrd-16 img-responsive"
                            src={image}
                            alt="Small-scale fisheries"
                            width={764}
                            height={885}
                            loading="lazy"
                        />
                    </div>
                    <div className="col-lg-6 col-sm-12 block-we-do">
                        <h3 className="text-heading-1 mt-30">{title}</h3>
                        <RichText
                            content={subtitle}
                            className="text-body-lead-large color-gray-600 mt-30"
                        />
                        <div className="line-bd-green mt-50" />
                        <div className="row">
                            {features.map((feature, index) => (
                                <div key={index} className="col-lg-6 col-sm-6 col-12 mt-50">
                                    <h4 className="text-heading-6 icon-leaf">{feature.title}</h4>
                                    <RichText
                                        content={feature.description}
                                        className="text-body-excerpt color-gray-600 mt-15"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutSection;
