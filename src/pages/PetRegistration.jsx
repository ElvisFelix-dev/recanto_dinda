
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PawPrint,
  ArrowLeft,
  ArrowRight,
  Check,
  UserRound,
  Dog,
  HeartPulse,
  Stethoscope,
  ClipboardCheck,
  Upload,
  ImagePlus,
  FileText,
  X,
  Info,
  AlertCircle,
  MessageCircle,
  Instagram,
  ArrowUpRight,
} from "lucide-react";

const steps = [
  { label: "Tutor", icon: UserRound },
  { label: "Pet", icon: Dog },
  { label: "Saúde", icon: HeartPulse },
  { label: "Veterinário", icon: Stethoscope },
  { label: "Declarações", icon: ClipboardCheck },
];

const vaccines = [
  "Vacina Polivalente",
  "Antirrábica",
  "Giardia",
  "Gripe canina",
];

const declarations = [
  "Declaro que todas as informações prestadas são verdadeiras.",
  "Declaro que meu pet encontra-se em condições de saúde para frequentar o espaço.",
  "Declaro que meu pet tomou todas as vacinas necessárias para frequentar o espaço.",
  "Estou ciente de que, mesmo com todos os cuidados, cães podem apresentar intercorrências, acidentes ou doenças inerentes à convivência entre animais.",
  "Autorizo que, em caso de urgência, sejam tomadas as medidas necessárias para preservar a saúde do meu pet.",
  "Estou ciente de que eventuais despesas veterinárias decorrentes de atendimento de emergência serão de minha responsabilidade.",
];

const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10";

const labelClass =
  "block text-sm font-bold text-emerald-950";

function FormField({ label, required = false, children, hint, tooltip }) {
  const tooltipText = tooltip || hint || `Preencha este campo com a informação correta sobre ${label.toLowerCase()}.`;

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <span className={labelClass}>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </span>
        <span className="group relative inline-flex shrink-0" tabIndex={0}>
          <Info size={15} className="cursor-help text-emerald-700/70 transition group-hover:text-emerald-800 group-focus:text-emerald-800" aria-label={`Ajuda: ${label}`} />
          <span role="tooltip" className="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-2 w-60 -translate-x-1/2 rounded-xl bg-emerald-950 px-3 py-2 text-left text-xs font-medium leading-5 text-white opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100">
            {tooltipText}
          </span>
        </span>
      </div>
      {children}
      {hint && (
        <p className="mt-1.5 text-xs leading-5 text-stone-500">
          {hint}
        </p>
      )}
    </div>
  );
}

function StepHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-7">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-emerald-950 sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-stone-500">
        {description}
      </p>
    </div>
  );
}

function onlyDigits(value) {
  return value.replace(/\D/g, "");
}

function formatCPF(value) {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function isValidCPF(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(cpf[10]);
}

export default function PetRegistration() {
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Cria miniaturas temporárias para imagens e URLs locais para abrir PDFs.
  useEffect(() => {
    const previews = files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    }));
    setFilePreviews(previews);

    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [files]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview('');
      return undefined;
    }
    const previewUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [avatarFile]);

  const [hasAllergy, setHasAllergy] = useState("");
  const [usesMedication, setUsesMedication] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const toggleVaccine = (vaccine) => {
    setSelectedVaccines((current) =>
      current.includes(vaccine)
        ? current.filter((item) => item !== vaccine)
        : [...current, vaccine]
    );
  };

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const combined = [...files, ...selectedFiles];

    if (combined.length > 5) {
      setFormStatus("Você pode enviar no máximo 5 arquivos.");
      event.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    const invalidType = selectedFiles.some(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidType) {
      setFormStatus("Envie imagens JPG, PNG, WebP ou arquivos PDF.");
      event.target.value = "";
      return;
    }

    const oversized = selectedFiles.some(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (oversized) {
      setFormStatus("Cada arquivo deve ter no máximo 10 MB.");
      event.target.value = "";
      return;
    }

    setFiles(combined);
    setFormStatus("");
    event.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const handleAvatarFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFormStatus("A foto do pet deve estar em JPG, PNG ou WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormStatus("A foto do pet deve ter no máximo 5 MB.");
      return;
    }
    setAvatarFile(file);
    setFormStatus("");
  };

  const validateCurrentStep = () => {
    const form = formRef.current;

    if (!form) return false;

    const activeSection = form.querySelector(`[data-step="${currentStep}"]`);
    if (!activeSection) return false;

    // Valida somente os campos da etapa atual; as demais etapas ficam montadas
    // no DOM para preservar os valores, mas não devem bloquear a navegação.
    const activeFields = activeSection.querySelectorAll(
      'input:not([type="file"]), select, textarea'
    );

    for (const field of activeFields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }

    if (currentStep === 0) {
      const cpfInput = form.querySelector('[name="cpf"]');
      const rgInput = form.querySelector('[name="rg"]');
      const phoneInput = form.querySelector('[name="phone"]');
      if (cpfInput && !isValidCPF(cpfInput.value)) {
        cpfInput.setCustomValidity("Informe um CPF válido.");
        cpfInput.reportValidity();
        cpfInput.setCustomValidity("");
        return false;
      }
      const rgLength = rgInput?.value.trim().replace(/[^a-zA-Z0-9]/g, "").length || 0;
      if (rgInput && (rgLength < 5 || rgLength > 14)) {
        rgInput.setCustomValidity("Confira o RG. Informe entre 5 e 14 caracteres, sem contar pontuação.");
        rgInput.reportValidity();
        rgInput.setCustomValidity("");
        return false;
      }
      if (phoneInput && ![10, 11].includes(onlyDigits(phoneInput.value).length)) {
        phoneInput.setCustomValidity("Informe um telefone com DDD e número válido.");
        phoneInput.reportValidity();
        phoneInput.setCustomValidity("");
        return false;
      }
    }

    if (currentStep === 2 && !vaccines.every((vaccine) => selectedVaccines.includes(vaccine))) {
      setFormStatus("Para continuar, confirme que seu pet possui as quatro vacinas obrigatórias.");
      return false;
    }

    if (currentStep === 2 && files.length === 0) {
      setFormStatus("Anexe a carteira de vacinação do seu pet.");
      return false;
    }

    if (currentStep === 3) {
      const vetPhoneInput = form.querySelector('[name="vetPhone"]');
      if (vetPhoneInput && ![10, 11].includes(onlyDigits(vetPhoneInput.value).length)) {
        vetPhoneInput.setCustomValidity("Informe um telefone com DDD válido.");
        vetPhoneInput.reportValidity();
        vetPhoneInput.setCustomValidity("");
        return false;
      }
    }

    if (currentStep === 4) {
      const unchecked = form.querySelectorAll(
        'input[name="declarations"]:not(:checked)'
      );

      if (unchecked.length > 0) {
        setFormStatus("Confirme todas as declarações para continuar.");
        return false;
      }
    }

    setFormStatus("");
    return true;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;

    setCurrentStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previousStep = () => {
    setFormStatus("");
    setCurrentStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || isSubmitted) return;
    if (!validateCurrentStep()) return;

    const form = formRef.current;
    if (!form) return;

    const getValue = (name) =>
      form.querySelector(`[name="${name}"]`)?.value?.trim() || "";

    const checked = (name) =>
      Boolean(form.querySelector(`[name="${name}"]`)?.checked);

    const declarationChecks = Array.from(
      form.querySelectorAll('input[name="declarations"]')
    ).map((input) => input.checked);

    const payload = {
      guardian: {
        name: getValue("tutorName"),
        cpf: getValue("cpf"),
        rg: getValue("rg"),
        address: getValue("address"),
        phone: getValue("phone"),
        email: getValue("email"),
      },
      pet: {
        name: getValue("petName"),
        breed: getValue("breed"),
        sex: getValue("sex"),
        neutered:
          form.querySelector('[name="neutered"]:checked')?.value === "Sim",
        vaccines: {
          polyvalent: selectedVaccines.includes("Vacina Polivalente"),
          rabies: selectedVaccines.includes("Antirrábica"),
          giardia: selectedVaccines.includes("Giardia"),
          canineFlu: selectedVaccines.includes("Gripe canina"),
        },
        lastDewormingDate: getValue("dewormingDate"),
        fleaTreatmentProduct: getValue("fleaTreatmentProduct"),
        lastFleaTreatmentDate: getValue("lastFleaTreatmentDate"),
        hasAllergies: hasAllergy === "Sim",
        allergyDetails: getValue("allergyDetails"),
        takesMedication: usesMedication === "Sim",
        medicationDetails: getValue("medicationDetails"),
        veterinarian: {
          clinic: getValue("clinicName"),
          name: getValue("vetName"),
          phone: getValue("vetPhone"),
        },
        emergencyAuthorization: checked("emergencyAuthorization"),
        declarations: {
          truthfulInformation: declarationChecks[0] === true,
          adequateHealth: declarationChecks[1] === true,
          requiredVaccines: declarationChecks[2] === true,
          socializationRisks: declarationChecks[3] === true,
          emergencyMeasures: declarationChecks[4] === true,
          veterinaryExpenses: declarationChecks[5] === true,
        },
      },
    };

    const formData = new FormData();
    formData.append("payload", JSON.stringify(payload));
    files.forEach((file) => formData.append("vaccinationCards", file));
    if (avatarFile) formData.append("avatar", avatarFile);

    const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3333")
      .replace(/\/+$/, "");
    const apiRoot = apiBaseUrl.endsWith("/api") ? apiBaseUrl : `${apiBaseUrl}/api`;

    setIsSubmitting(true);
    setFormStatus("");

    try {
      const response = await fetch(
        `${apiRoot}/pet-registrations`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const validationMessage = Array.isArray(result.errors)
          ? result.errors.map((item) => item.message).filter(Boolean).join(" ")
          : "";

        throw new Error(
          validationMessage ||
          result.message ||
          "Não foi possível enviar o cadastro. Tente novamente."
        );
      }

      setIsSubmitted(true);
      setFormStatus("");
      showToast("Cadastro realizado com sucesso! 🐾 Estamos preparando tudo por aqui.");

      // Dá tempo para a pessoa visualizar o toast antes de abrir a confirmação.
      window.setTimeout(() => {
        navigate("/cadastro-sucesso", {
          replace: true,
          state: {
            petName: payload.pet.name,
            tutorName: payload.guardian.name,
          },
        });
      }, 1500);
    } catch (error) {
      const message =
        error.message ||
        "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
      setFormStatus(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappUrl =
    "https://wa.me/5511925755222?text=" +
    encodeURIComponent("Olá! Estou preenchendo o cadastro do meu pet e gostaria de tirar uma dúvida.");

  return (
    <div className="min-h-screen bg-[#fffdf8] font-sans text-stone-800">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-md items-start gap-3 rounded-2xl border p-4 shadow-2xl sm:right-6 sm:top-6 ${
            toast.type === "error"
              ? "border-red-200 bg-white text-red-900"
              : "border-emerald-200 bg-emerald-950 text-white"
          }`}
        >
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
            toast.type === "error" ? "bg-red-50 text-red-600" : "bg-emerald-800 text-emerald-200"
          }`}>
            {toast.type === "error" ? <AlertCircle size={21} /> : <Check size={21} />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold">
              {toast.type === "error" ? "Ops! Não foi dessa vez." : "Cadastro enviado! 🎉"}
            </p>
            <p className={`mt-1 text-sm leading-5 ${
              toast.type === "error" ? "text-red-700" : "text-emerald-100"
            }`}>
              {toast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Fechar aviso"
            className="rounded-lg p-1 opacity-75 transition hover:bg-white/10 hover:opacity-100"
          >
            <X size={18} />
          </button>
        </div>
      )}
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-emerald-950/5 bg-[#fffdf8]/95 shadow-sm shadow-emerald-950/[0.02] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2"
            aria-label="Recanto da Dinda - página inicial"
            title="Voltar para a página inicial"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-100 text-orange-700 transition group-hover:-rotate-6">
              <PawPrint size={27} strokeWidth={2.5} />
            </span>
            <span className="leading-none">
              <span className="block text-lg font-black tracking-tight text-emerald-950">Recanto</span>
              <span className="mt-1 block text-sm font-extrabold italic text-emerald-800">da Dinda</span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 sm:flex">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-50 text-emerald-700">
              <HeartPulse size={15} />
            </span>
            <span className="text-xs font-semibold text-stone-600">Cuidado e atenção em cada etapa</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden items-center gap-1 rounded-full px-3 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 sm:inline-flex"
            >
              <ArrowLeft size={15} />
              Voltar ao site
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              title="Fale com a equipe do Recanto da Dinda pelo WhatsApp"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-emerald-900/10 transition hover:bg-emerald-800 sm:min-h-11 sm:px-5 sm:text-sm"
            >
              <MessageCircle size={16} />
              <span>Fale conosco</span>
            </a>
          </div>
        </div>
      </header>

      <main className="min-h-[70vh] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        {/* CABEÇALHO */}
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-orange-100 text-orange-700">
            <PawPrint size={32} />
          </span>

          <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.24em] text-emerald-700">
            Recanto da Dinda
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-emerald-950 sm:text-4xl">
            Cadastro do seu pet
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-stone-600">
            Queremos conhecer você e seu melhor amigo! Preencha as
            informações para iniciarmos o processo de avaliação e admissão.
          </p>
        </div>

        {/* CARD DO FORMULÁRIO */}
        <div className="overflow-hidden rounded-[2rem] border border-emerald-950/5 bg-white shadow-xl shadow-emerald-950/5">
          {/* PROGRESSO */}
          <div className="border-b border-stone-100 px-5 py-6 sm:px-8">
            <div className="mb-5 flex items-center justify-between gap-3">
              <span className="text-sm font-extrabold text-emerald-950">
                Etapa {currentStep + 1} de {steps.length}
              </span>

              <span className="text-xs font-bold text-stone-500">
                {Math.round(progress)}% concluído
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {steps.map(({ label, icon: Icon }, index) => {
                const active = currentStep === index;
                const completed = currentStep > index;

                return (
                  <div
                    key={label}
                    title={`Etapa ${index + 1}: ${label}`}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                        active
                          ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/15"
                          : completed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-400"
                      }`}
                    >
                      {completed ? <Check size={18} /> : <Icon size={17} />}
                    </span>

                    <span
                      className={`text-[10px] font-bold sm:text-xs ${
                        active || completed
                          ? "text-emerald-900"
                          : "text-stone-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="p-5 sm:p-8"
          >
            {/* ETAPA 1 - TUTOR */}
            <section hidden={currentStep !== 0} data-step="0">

                <StepHeading
                  eyebrow="Primeira etapa"
                  title="Dados do tutor"
                  description="Conte um pouco sobre você. Precisamos desses dados para identificar o responsável pelo pet."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FormField label="Nome completo do tutor" required>
                      <input
                        name="tutorName"
                        type="text"
                        autoComplete="name"
                        placeholder="Digite seu nome completo"
                        className={inputClass}
                        required
                      />
                    </FormField>
                  </div>

                  <FormField label="CPF" required>
                    <input
                      name="cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      className={inputClass}
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={14}
                      onChange={(event) => { event.target.value = formatCPF(event.target.value); }}
                      required
                    />
                  </FormField>

                  <FormField label="RG" required>
                    <input
                      name="rg"
                      type="text"
                      placeholder="Digite seu RG"
                      className={inputClass}
                      required
                    />
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField label="Endereço completo" required>
                      <input
                        name="address"
                        type="text"
                        autoComplete="street-address"
                        placeholder="Rua, número, complemento, bairro e CEP"
                        className={inputClass}
                        required
                      />
                    </FormField>
                  </div>

                  <FormField label="Telefone / WhatsApp" required>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(11) 99999-9999"
                      className={inputClass}
                      onChange={(event) => { event.target.value = formatPhone(event.target.value); }}
                      required
                    />
                  </FormField>

                  <FormField label="E-mail" required>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className={inputClass}
                      required
                    />
                  </FormField>
                </div>
              </section>

            {/* ETAPA 2 - PET */}
            <section hidden={currentStep !== 1} data-step="1">

                <StepHeading
                  eyebrow="Segunda etapa"
                  title="Vamos conhecer seu pet"
                  description="Agora queremos saber um pouco mais sobre seu companheiro."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FormField label="Nome do pet" required>
                      <input
                        name="petName"
                        type="text"
                        placeholder="Como ele se chama?"
                        className={inputClass}
                        required
                      />
                    </FormField>
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      label="Foto do pet (opcional)"
                      hint="Envie uma foto para ajudar nossa equipe a identificar seu companheiro. JPG, PNG ou WebP, até 5 MB."
                    >
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAvatarFile}
                        className="hidden"
                      />
                      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-4 sm:flex-row sm:items-center">
                        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-emerald-100 bg-white">
                          {avatarPreview ? (
                            <img src={avatarPreview} alt="Pré-visualização da foto do pet" className="h-full w-full object-cover" />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-emerald-700"><PawPrint size={34} /></div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-emerald-950">{avatarFile ? avatarFile.name : "Adicione uma foto do seu pet"}</p>
                          <p className="mt-1 text-xs leading-5 text-stone-500">Uma foto frontal, com boa iluminação, ajuda a equipe a reconhecer seu pet.</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button type="button" onClick={() => avatarInputRef.current?.click()} title="Selecionar foto do pet" className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-900"><ImagePlus size={15} />{avatarFile ? "Trocar foto" : "Escolher foto"}</button>
                            {avatarFile && <button type="button" onClick={() => setAvatarFile(null)} title="Remover foto selecionada" className="rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50">Remover</button>}
                          </div>
                        </div>
                      </div>
                    </FormField>
                  </div>

                  <FormField label="Raça" required>
                    <input
                      name="breed"
                      type="text"
                      placeholder="Ex.: Golden Retriever"
                      className={inputClass}
                      required
                    />
                  </FormField>

                  <FormField label="Sexo" required>
                    <select
                      name="sex"
                      className={inputClass}
                      defaultValue=""
                      required
                    >
                      <option value="" disabled>
                        Selecione
                      </option>
                      <option value="female">Fêmea</option>
                      <option value="male">Macho</option>
                    </select>
                  </FormField>

                  <div className="sm:col-span-2">
                    <FormField label="O pet é castrado?" required>
                      <div className="grid grid-cols-2 gap-3">
                        {["Sim", "Não"].map((option) => (
                          <label
                            key={option}
                            title={`Selecione ${option.toLowerCase()}.`}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-4 transition has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50"
                          >
                            <input
                              type="radio"
                              name="neutered"
                              value={option}
                              required
                              className="accent-emerald-700"
                            />
                            <span className="text-sm font-bold text-stone-700">
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </FormField>
                  </div>
                </div>
              </section>

            {/* ETAPA 3 - SAÚDE */}
            <section hidden={currentStep !== 2} data-step="2">

                <StepHeading
                  eyebrow="Terceira etapa"
                  title="Saúde e vacinação"
                  description="Essas informações ajudam a equipe a conhecer os cuidados e as necessidades do seu pet."
                />

                <div className="space-y-7">
                  <FormField
                    label="Vacinas obrigatórias para uso do espaço"
                    required
                    hint="Selecione as vacinas correspondentes à carteira do seu pet."
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      {vaccines.map((vaccine) => (
                        <label
                          key={vaccine}
                          title={`Confirme se a vacina ${vaccine} está registrada na carteira de vacinação.`}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-4 transition has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50"
                        >
                          <input
                            type="checkbox"
                            aria-label={vaccine}
                            checked={selectedVaccines.includes(vaccine)}
                            onChange={() => toggleVaccine(vaccine)}
                            className="h-4 w-4 accent-emerald-700"
                          />
                          <span className="text-sm font-semibold text-stone-700">
                            {vaccine}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FormField>

                  <FormField
                    label="Carteira de vacinação"
                    required
                    hint="Envie até 5 arquivos. Imagens ou PDF, com no máximo 10 MB por arquivo."
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf,.jpg,.jpeg,.png,.webp,.pdf"
                      multiple
                      onChange={handleFiles}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Anexe fotos ou PDF da carteira de vacinação. Até 5 arquivos, 10 MB cada."
                      className="flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 px-5 py-8 text-center transition hover:border-emerald-500 hover:bg-emerald-50"
                    >
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                        <Upload size={23} />
                      </span>

                      <span className="mt-3 text-sm font-extrabold text-emerald-950">
                        Clique para anexar os arquivos
                      </span>

                      <span className="mt-1 text-xs text-stone-500">
                        JPG, PNG, WebP ou PDF
                      </span>
                    </button>

                    {files.length > 0 && (
                      <div className="mt-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-xs font-extrabold uppercase tracking-[.14em] text-emerald-950">Arquivos selecionados</p>
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">{files.length}/5 anexos</span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {files.map((file, index) => {
                            const preview = filePreviews[index];
                            const isImage = file.type.startsWith("image/");
                            return (
                              <div key={`${file.name}-${file.size}-${index}`} className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                                <div className="relative flex h-36 items-center justify-center overflow-hidden bg-stone-100">
                                  {isImage && preview ? (
                                    <img src={preview.url} alt={`Pré-visualização de ${file.name}`} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="flex flex-col items-center gap-2 text-rose-600">
                                      <FileText size={38} strokeWidth={1.5} />
                                      <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-extrabold tracking-wider">DOCUMENTO PDF</span>
                                    </div>
                                  )}
                                  <button type="button" onClick={() => removeFile(index)} title={`Remover ${file.name}`} aria-label={`Remover ${file.name}`} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-stone-600 shadow-md transition hover:bg-rose-600 hover:text-white">
                                    <X size={16} />
                                  </button>
                                </div>
                                <div className="flex min-w-0 items-center justify-between gap-2 px-3 py-3">
                                  <div className="min-w-0">
                                    <p title={file.name} className="truncate text-xs font-bold text-stone-800">{file.name}</p>
                                    <p className="mt-1 text-[11px] text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB · {isImage ? "Imagem" : "PDF"}</p>
                                  </div>
                                  <span className="shrink-0 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800">Anexado</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </FormField>

                  <FormField label="Data da última vermifugação" required>
                    <input
                      name="dewormingDate"
                      type="date"
                      max={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
                      className={inputClass}
                      required
                    />
                  </FormField>

                  <FormField
                    label="Produto antipulgas utilizado"
                    required
                    hint="Informe o nome do produto utilizado, como Simparic, Bravecto ou NexGard."
                  >
                    <input
                      name="fleaTreatmentProduct"
                      type="text"
                      placeholder="Ex.: Simparic 20–40 kg"
                      className={inputClass}
                      required
                    />
                  </FormField>

                  <FormField
                    label="Data da última aplicação do antipulgas"
                    required
                  >
                    <input
                      name="lastFleaTreatmentDate"
                      type="date"
                      max={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)}
                      className={inputClass}
                      required
                    />
                  </FormField>

                  <FormField label="Possui alergia?" required>
                    <div className="grid grid-cols-2 gap-3">
                      {["Sim", "Não"].map((option) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-4 transition has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50"
                        >
                          <input
                            type="radio"
                            name="hasAllergy"
                            value={option}
                            checked={hasAllergy === option}
                            onChange={(event) =>
                              setHasAllergy(event.target.value)
                            }
                            required
                            className="accent-emerald-700"
                          />
                          <span className="text-sm font-bold text-stone-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FormField>

                  <div hidden={hasAllergy !== "Sim"}>
                    <FormField label="Quais alergias?" required={hasAllergy === "Sim"}>
                      <textarea
                        name="allergyDetails"
                        rows={3}
                        placeholder="Descreva as alergias conhecidas..."
                        className={inputClass}
                        required={hasAllergy === "Sim"}
                      />
                    </FormField>
                  </div>

                  <FormField label="Faz uso de medicamentos?" required>
                    <div className="grid grid-cols-2 gap-3">
                      {["Sim", "Não"].map((option) => (
                        <label
                          key={option}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 p-4 transition has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50"
                        >
                          <input
                            type="radio"
                            name="usesMedication"
                            value={option}
                            checked={usesMedication === option}
                            onChange={(event) =>
                              setUsesMedication(event.target.value)
                            }
                            required
                            className="accent-emerald-700"
                          />
                          <span className="text-sm font-bold text-stone-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </FormField>

                  <div hidden={usesMedication !== "Sim"}>
                    <FormField label="Quais medicamentos e dosagens?" required={usesMedication === "Sim"}>
                      <textarea
                        name="medicationDetails"
                        rows={3}
                        placeholder="Informe o nome, dosagem e frequência..."
                        className={inputClass}
                        required={usesMedication === "Sim"}
                      />
                    </FormField>
                  </div>
                </div>
              </section>

            {/* ETAPA 4 - VETERINÁRIO */}
            <section hidden={currentStep !== 3} data-step="3">

                <StepHeading
                  eyebrow="Quarta etapa"
                  title="Informações veterinárias"
                  description="Precisamos dos contatos de referência para situações que exijam atenção veterinária."
                />

                <div className="grid gap-5">
                  <FormField label="Nome da clínica veterinária" required>
                    <input
                      name="clinicName"
                      type="text"
                      placeholder="Nome da clínica"
                      className={inputClass}
                    required
                    />
                  </FormField>

                  <FormField label="Nome do veterinário" required>
                    <input
                      name="vetName"
                      type="text"
                      placeholder="Nome do profissional"
                      className={inputClass}
                    required
                    />
                  </FormField>

                  <FormField label="Telefone da clínica ou veterinário" required>
                    <input
                      name="vetPhone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className={inputClass}
                    onChange={(event) => { event.target.value = formatPhone(event.target.value); }}
                        required
                    />
                  </FormField>

                  <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-orange-700">
                        <HeartPulse size={21} />
                      </span>

                      <div>
                        <h3 className="font-extrabold text-emerald-950">
                          Autorização para atendimento emergencial
                        </h3>

                        <p className="mt-2 text-sm leading-7 text-stone-700">
                          Em caso de emergência veterinária, autorizo o
                          Recanto da Dinda a encaminhar meu pet para
                          atendimento veterinário, comprometendo-me a arcar
                          com todas as despesas decorrentes.
                        </p>
                      </div>
                    </div>

                    <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-orange-200 bg-white p-4">
                      <input
                        type="checkbox"
                        name="emergencyAuthorization"
                        value="Sim"
                        required
                        className="h-4 w-4 accent-emerald-700"
                      />
                      <span className="text-sm font-extrabold text-emerald-950">
                        Sim, autorizo o atendimento emergencial.
                        <span className="ml-1 text-red-500">*</span>
                      </span>
                    </label>
                  </div>
                </div>
              </section>

            {/* ETAPA 5 - DECLARAÇÕES */}
            <section hidden={currentStep !== 4} data-step="4">

                <StepHeading
                  eyebrow="Última etapa"
                  title="Declarações e responsabilidade"
                  description="Leia atentamente cada declaração e confirme sua concordância antes de finalizar."
                />

                <div className="space-y-3">
                  {declarations.map((declaration, index) => (
                    <label
                      key={index}
                      title={`Leia e confirme: ${declaration}`}
                      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200 p-4 transition has-[:checked]:border-emerald-600 has-[:checked]:bg-emerald-50"
                    >
                      <input
                        type="checkbox"
                        name="declarations"
                        value={declaration}
                        required
                        className="mt-1 h-4 w-4 shrink-0 accent-emerald-700"
                      />

                      <span className="text-sm leading-6 text-stone-700">
                        {declaration}
                        <span className="ml-1 font-bold text-red-500">*</span>
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-stone-50 p-5">
                  <div className="flex items-start gap-3">
                    <ClipboardCheck
                      size={21}
                      className="mt-0.5 shrink-0 text-emerald-700"
                    />

                    <p className="text-xs leading-6 text-stone-600">
                      Ao finalizar, você confirma que revisou as informações
                      preenchidas e que está de acordo com as declarações
                      apresentadas. A equipe do Recanto da Dinda poderá
                      entrar em contato para dar continuidade à avaliação
                      do seu pet.
                    </p>
                  </div>
                </div>
              </section>

            {/* MENSAGEM DE VALIDAÇÃO */}
            {formStatus && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-6 flex items-start gap-2 rounded-xl border p-4 text-sm leading-6 ${(isSubmitted) ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-orange-200 bg-orange-50 text-orange-900"}`}
              >
                {(isSubmitted) ? <Check size={18} className="mt-0.5 shrink-0" /> : <AlertCircle size={18} className="mt-0.5 shrink-0" />}
                <span>{formStatus}</span>
              </div>
            )}

            {/* NAVEGAÇÃO */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={previousStep}
                disabled={currentStep === 0}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-stone-200 px-6 py-3 text-sm font-bold text-stone-600 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={17} />
                Voltar
              </button>

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  title="Validar os campos desta etapa e continuar"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-emerald-700 px-7 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800"
                >
                  Continuar
                  <ArrowRight size={17} />
                </button>
              ) : (
                <button
                  type="submit"
                  title={isSubmitted ? "Cadastro enviado" : "Enviar cadastro para o Recanto da Dinda"}
                  disabled={isSubmitting || isSubmitted}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-orange-400 px-7 py-3 text-sm font-extrabold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Enviando cadastro..." : isSubmitted ? "Cadastro enviado" : "Enviar cadastro"}
                  <Check size={18} />
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs leading-6 text-stone-500">
          Recanto da Dinda · Cuidado, diversão e bem-estar.
        </p>
      </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#103c2e] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label="Recanto da Dinda - página inicial">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-orange-300">
                <PawPrint size={27} />
              </span>
              <span>
                <strong className="block text-lg font-black">Recanto da Dinda</strong>
                <span className="mt-1 block text-xs text-white/65">Cuidado, diversão e bem-estar.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
              Um espaço pensado para oferecer momentos de cuidado, socialização e diversão para o seu melhor amigo.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-white">Precisa de ajuda?</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Se tiver dúvidas durante o preenchimento, nossa equipe está à disposição para ajudar.
            </p>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-300 transition hover:text-orange-200">
              <MessageCircle size={17} />
              Falar com a equipe
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-white">Acompanhe o Recanto</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Conheça nosso espaço, novidades e momentos especiais dos nossos hóspedes.
            </p>
            <a href="https://www.instagram.com/recanto_dadinda/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-300 transition hover:text-orange-200">
              <Instagram size={17} />
              @recanto_dadinda
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Recanto da Dinda. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
