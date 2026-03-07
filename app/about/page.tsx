import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Separator } from '@/components/ui/Separator';
import { ABOUT_PAGE_CONTENT, SITE_CONTACT, SITE_COPY, SITE_NAME } from '@/lib/site-content';
import {
  Globe,
  Target,
  Rocket,
  ShieldCheck,
  BadgeDollarSign,
  Star,
  Users,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: `About ${SITE_NAME}`,
  description: SITE_COPY.metadataDescription,
};

const PILLAR_ICONS = [ShieldCheck, BadgeDollarSign, Star, Users];

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* ── Hero Banner ── */}
      <section className="relative bg-primary overflow-hidden py-16 md:py-24">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(201,163,74,0.7) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(201,163,74,0.5) 0%, transparent 50%)',
          }}
        />
        <Container>
          <div className="relative z-10 max-w-3xl mx-auto text-center px-4 space-y-5">
            <Badge
              variant="outline"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border-secondary/40 text-secondary text-xs font-bold tracking-wider uppercase backdrop-blur-sm"
            >
              <Globe className="w-3 h-3" />
              Made in Kerala — Global Movement
            </Badge>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              About <span className="text-secondary">{SITE_NAME}</span>
            </h1>
            <p className="text-base sm:text-lg text-white/75 leading-relaxed max-w-2xl mx-auto">
              {SITE_COPY.shortDescription}
            </p>
          </div>
        </Container>
      </section>

      {/* ── Who We Are ── */}
      <section className="py-14 md:py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto px-4 space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Who We Are</h2>
            <Separator className="w-16 bg-secondary h-[3px]" />
            {ABOUT_PAGE_CONTENT.aboutParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-slate-600 leading-relaxed text-sm sm:text-[15px]">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Social Cause-Led Movement ── */}
      <section className="py-14 md:py-20 bg-primary/5">
        <Container>
          <div className="max-w-3xl mx-auto px-4 space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              A Social Cause–Led Export Movement
            </h2>
            <Separator className="w-16 bg-secondary h-[3px]" />
            {ABOUT_PAGE_CONTENT.socialCauseParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-slate-600 leading-relaxed text-sm sm:text-[15px]">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      {/* ── What Makes Us Different ── */}
      <section className="py-14 md:py-20 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto px-4 space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">
                What Makes Us Different
              </h2>
              <Separator className="w-16 bg-secondary h-[3px]" />
            </div>
            <ul className="space-y-3">
              {ABOUT_PAGE_CONTENT.whatMakesUsDifferent.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm sm:text-[15px]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-base font-semibold text-primary border-l-4 border-secondary pl-4">
              Manufacturers grow. Buyers trust. Kerala wins.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="py-14 md:py-20 bg-primary">
        <Container>
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white">Our Vision</h3>
              <Separator className="w-10 bg-secondary/60 h-[2px]" />
              <p className="text-white/75 leading-relaxed text-sm sm:text-[15px]">
                {ABOUT_PAGE_CONTENT.vision}
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-white">Our Mission</h3>
              <Separator className="w-10 bg-secondary/60 h-[2px]" />
              <p className="text-white/75 leading-relaxed text-sm sm:text-[15px]">
                {ABOUT_PAGE_CONTENT.mission}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Core Pillars ── */}
      <section className="py-14 md:py-20 bg-slate-50">
        <Container>
          <div className="max-w-4xl mx-auto px-4 space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">Our Core Pillars</h2>
              <Separator className="w-16 bg-secondary h-[3px] mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {ABOUT_PAGE_CONTENT.corePillars.map((pillar, i) => {
                const Icon = PILLAR_ICONS[i] ?? ShieldCheck;
                return (
                  <Card
                    key={pillar.title}
                    className="border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-base font-semibold text-primary">{pillar.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{pillar.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA Band ── */}
      <section className="py-14 md:py-20 bg-secondary/10 border-y border-secondary/20">
        <Container>
          <div className="max-w-3xl mx-auto px-4 text-center space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">
              Let&apos;s Build Global Demand Together
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Whether you are a manufacturer, buyer, or ecosystem partner — {SITE_NAME} would love
              to connect.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3 rounded-full text-sm hover:bg-primary/90 transition-colors shadow-md"
              >
                Register as Exporter <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register/importer"
                className="inline-flex items-center gap-2 border border-primary text-primary font-semibold px-7 py-3 rounded-full text-sm hover:bg-primary/5 transition-colors"
              >
                Register as Buyer
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Contact ── */}
      <section className="py-14 md:py-20 bg-slate-50">
        <Container>
          <div className="max-w-2xl mx-auto px-4 space-y-8">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold text-primary">Contact Details</h2>
              <Separator className="w-16 bg-secondary h-[3px]" />
            </div>
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white overflow-hidden">
              <div className="flex items-start gap-4 px-6 py-5">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-slate-700 text-sm leading-relaxed">
                  {SITE_CONTACT.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 px-6 py-5">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <Link
                  href={`mailto:${SITE_CONTACT.email}`}
                  className="text-sm text-slate-700 hover:text-primary transition-colors"
                >
                  {SITE_CONTACT.email}
                </Link>
              </div>
              <div className="flex items-center gap-4 px-6 py-5">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <Link
                  href={`tel:${SITE_CONTACT.phoneHref}`}
                  className="text-sm text-slate-700 hover:text-primary transition-colors"
                >
                  {SITE_CONTACT.phoneDisplay}
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
