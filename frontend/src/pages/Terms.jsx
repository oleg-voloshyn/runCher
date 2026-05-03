import Layout from '../components/Layout'

export default function Terms() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: May 3, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using RunCher ("the Service"), you agree to be bound by these Terms
              of Service. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Description of Service</h2>
            <p>
              RunCher is a running tournament platform for athletes in Cherkasy, Ukraine. The
              Service allows participants to compete in segment-based running tournaments using
              activity data synchronized from their Strava accounts. Scores are calculated
              automatically based on elapsed time on designated route segments.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. Strava Account Requirement</h2>
            <p>
              The Service requires a valid Strava account. By connecting your Strava account, you
              authorize RunCher to access your Strava data as described in our{' '}
              <a href="/privacy" className="text-[#fc4c02] hover:underline">
                Privacy Policy
              </a>
              . You remain responsible for your Strava account and must comply with{' '}
              <a
                href="https://www.strava.com/legal/terms"
                target="_blank"
                rel="noreferrer"
                className="text-[#fc4c02] hover:underline"
              >
                Strava's Terms of Service
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Eligibility</h2>
            <p>
              The Service is open to all athletes with a Strava account. Tournament participation
              may require approval by tournament organizers. Organizers reserve the right to remove
              participants who violate these terms or act in bad faith.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Fair Play</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Submit fraudulent, manually edited, or vehicle-assisted Strava activities</li>
              <li>Use multiple Strava accounts to gain an unfair advantage</li>
              <li>Attempt to manipulate the scoring system in any way</li>
              <li>Interfere with the Service or other participants' experience</li>
            </ul>
            <p className="mt-3">
              Violations may result in disqualification and removal from tournaments.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Data Accuracy</h2>
            <p>
              Scores are calculated based on data provided by the Strava API. RunCher is not
              responsible for inaccuracies in GPS data, segment matching, or timing discrepancies
              originating from Strava. Disputes about scores should be raised with tournament
              organizers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Intellectual Property</h2>
            <p>
              All content, design, and code of the RunCher platform is owned by the RunCher team.
              You may not reproduce, copy, or redistribute any part of the Service without written
              permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "as is" without warranties of any kind. We do not guarantee
              continuous availability, accuracy of scores, or fitness for any particular purpose.
              Participation in running events involves physical risk — RunCher is not liable for
              any injury or harm resulting from tournament participation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, RunCher shall not be liable for any indirect,
              incidental, or consequential damages arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of the Service
              after changes constitutes acceptance of the updated Terms. Material changes will be
              communicated via the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">11. Contact</h2>
            <p>
              Questions about these Terms can be directed to{' '}
              <a href="mailto:oleh.runcher@gmail.com" className="text-[#fc4c02] hover:underline">
                oleh.runcher@gmail.com
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </Layout>
  )
}
