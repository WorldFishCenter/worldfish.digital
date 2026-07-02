import Layout from '../layout/Layout';
import RichText from '../content/RichText';

export default function TeamPageClient({ team }) {
    return (
        <Layout>
            <section className="section-box wfSectionDark wfPadHeroSm">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <h1 className="display-3 wfTitleHero">Team</h1>
                            <p className="wfLead wfLeadMt">
                                The people building and maintaining WorldFish Digital's platforms.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section-box wfSectionDark wfPadSection">
                <div className="container">
                    <div className="row">
                        {team.map((member) => (
                            <div key={member.slug} className="col-lg-3 col-sm-6 mb-30 d-flex">
                                <div className="wfFeatureCard">
                                    <div className="wfAvatarPlaceholder" aria-hidden="true">
                                        {member.initials}
                                    </div>
                                    <h4 className="wfHeadingFeature mt-20">{member.name}</h4>
                                    <p className="wfMuted mb-10">{member.role}</p>
                                    <RichText content={member.bio} className="wfFeatureBody" />
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="wfMuted d-block mt-10 text-decoration-none"
                                    >
                                        {member.email}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </Layout>
    );
}
