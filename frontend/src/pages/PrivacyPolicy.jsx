import Layout from '../components/Layout'

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: May 3, 2026</p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">1. About RunCher</h2>
            <p>
              RunCher ("we", "us", or "our") is a running tournament platform for athletes in
              Cherkasy, Ukraine. We connect to your Strava account to organize segment-based
              competitions. This Privacy Policy explains what personal data we collect, why we
              collect it, and how we use it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">2. Data We Collect from Strava</h2>
            <p className="mb-3">
              When you authorize RunCher via Strava OAuth, we request the following Strava scopes:
              <code className="bg-gray-100 px-1 rounded text-xs mx-1">read</code>
              <code className="bg-gray-100 px-1 rounded text-xs mx-1">profile:read_all</code>
              <code className="bg-gray-100 px-1 rounded text-xs mx-1">activity:read_all</code>
            </p>
            <p className="mb-2">We store the following data from your Strava profile:</p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>First name, last name, and full name</li>
              <li>Email address (if provided by Strava)</li>
              <li>Profile picture URL</li>
              <li>Strava athlete ID</li>
              <li>Gender (used for gender-separated leaderboards)</li>
            </ul>
            <p className="mb-2">We store the following data from your Strava activities:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Activity name, type, start date</li>
              <li>Distance and elapsed time</li>
              <li>Segment efforts: segment ID, elapsed time, start date — only for segments that belong to active RunCher tournaments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To identify you and display your profile within the platform</li>
              <li>To calculate your tournament scores based on segment efforts</li>
              <li>To display your results on tournament leaderboards</li>
              <li>To determine completion order and award bonuses in tournaments</li>
            </ul>
            <p className="mt-3">
              We do not use your data for advertising, profiling, or any purpose beyond operating
              the RunCher platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">4. Data Sharing</h2>
            <p>
              We do not sell, rent, or share your personal data with third parties, except as
              required by law. Your name and tournament results may be visible to other participants
              on public leaderboards within RunCher.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">5. Strava API Usage</h2>
            <p>
              This application uses the{' '}
              <a
                href="https://developers.strava.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#fc4c02] hover:underline"
              >
                Strava API
              </a>
              . By connecting your Strava account, you also agree to the{' '}
              <a
                href="https://www.strava.com/legal/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-[#fc4c02] hover:underline"
              >
                Strava Privacy Policy
              </a>
              . We access Strava data only on your explicit request (manual sync) and store only
              the minimum data necessary to operate the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">6. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active. If you disconnect your
              Strava account or request deletion, we will remove your personal data within 30 days.
              Tournament scores that are part of the historical record may be anonymized rather than
              deleted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Revoke Strava access at any time via{' '}
                <a
                  href="https://www.strava.com/settings/apps"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#fc4c02] hover:underline"
                >
                  Strava Settings → My Apps
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">8. Security</h2>
            <p>
              Strava access tokens are stored securely and refreshed automatically using OAuth 2.0
              refresh tokens. We do not store your Strava password.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">9. Contact</h2>
            <p>
              If you have questions about this Privacy Policy or want to request data deletion,
              please contact us at{' '}
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
